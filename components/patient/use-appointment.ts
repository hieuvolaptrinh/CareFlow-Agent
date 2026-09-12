"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  getDocs,
  startAfter,
  documentId,
} from "firebase/firestore";
import { toast } from "sonner";
import { getFirebaseClient } from "@/lib/firebase/client";
import { api, ApiError, errorText } from "@/lib/api-client";
import type {
  AgentRun,
  Appointment,
  ChatMessage,
  Notice,
  SyncStatus,
} from "@/types/journey";

export function useAppointment(id: string) {
  const [sync, setSync] = useState<SyncStatus>("Pending");
  const [olderMessages, setOlderMessages] = useState<ChatMessage[]>([]);
  const [hasOlder, setHasOlder] = useState(false);
  const [historyBusy, setHistoryBusy] = useState(false);
  const ackRevision = useRef<number | null>(null);
  const serverRevision = useRef(-1);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]),
    [notices, setNotices] = useState<Notice[]>([]),
    [run, setRun] = useState<AgentRun | null>(null);
  const [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [online, setOnline] = useState(true),
    [cached, setCached] = useState(true);
  const lock = useRef(false),
    retry = useRef<{
      signature: string;
      requestId: string;
      revision: number;
    } | null>(null);
  const current = useRef(appointment);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  useEffect(() => {
    let active = true;
    const cleanup: (() => void)[] = [];
    const fail = (err: unknown) => {
      if (active) {
        setError(errorText(err));
        setLoading(false);
      }
    };
    api<Appointment>(`/api/appointments/${id}`)
      .then((initialAppointment) => {
        if (!active) return;
        const ref = doc(getFirebaseClient().db, "appointments", id);
        cleanup.push(
          onSnapshot(
            ref,
            { includeMetadataChanges: true },
            (snap) => {
              if (!snap.exists()) {
                setError("Ca khám không còn tồn tại.");
                setLoading(false);
                return;
              }
              current.current = snap.data() as Appointment;
              setAppointment(current.current);
              setCached(snap.metadata.fromCache);
              if (!snap.metadata.fromCache && !snap.metadata.hasPendingWrites) {
                serverRevision.current = current.current.revision;
                if (ackRevision.current !== null && serverRevision.current >= ackRevision.current) { setSync("Synced"); ackRevision.current = null; }
                else if (!lock.current) setSync((old) => old === "Error" ? old : "Synced");
              }
              setLoading(false);
            },
            fail,
          ),
        );
        cleanup.push(
          onSnapshot(
            query(
              collection(ref, "messages"),
              orderBy("createdAt", "desc"),
              orderBy(documentId(), "desc"),
              limit(40),
            ),
            (snap) => {
              setHasOlder(snap.size === 40);
              setMessages(
                snap.docs.map((d) => d.data() as ChatMessage).reverse(),
              );
            },
            fail,
          ),
        );
        let initial = true;
        cleanup.push(
          onSnapshot(
            query(
              collection(ref, "notifications"),
              orderBy("createdAt", "desc"),
              limit(50),
            ),
            (snap) => {
              setNotices(snap.docs.map((d) => d.data() as Notice));
              if (!initial)
                snap
                  .docChanges()
                  .filter((c) => c.type === "added" && !c.doc.data().read)
                  .forEach((c) => toast(c.doc.data().text));
              initial = false;
            },
            fail,
          ),
        );
        cleanup.push(
          onSnapshot(
            query(
              collection(ref, "agentRuns"),
              orderBy("startedAt", "desc"),
              limit(1),
            ),
            (snap) =>
              setRun(snap.empty ? null : (snap.docs[0].data() as AgentRun)),
            fail,
          ),
        );
        if (
          initialAppointment.status === "ACTIVE" &&
          !initialAppointment.simulationRun &&
          !initialAppointment.proposal
        ) {
          void api(`/api/appointments/${id}/actions`, {
            requestId: crypto.randomUUID(),
            revision: initialAppointment.revision,
            action: { type: "REASSESS" },
          }).catch((err) => {
            if (!(err instanceof ApiError && err.status === 409)) fail(err);
          });
        }
      })
      .catch(fail);
    return () => {
      active = false;
      cleanup.forEach((fn) => fn());
    };
  }, [id]);
  const send = useCallback(
    async (target: "messages" | "actions" | "simulation", value: unknown) => {
      if (lock.current || !current.current) return false;
      if (!navigator.onLine) {
        setSync("Error");
        setError("Bạn đang ngoại tuyến. Nội dung chưa được gửi.");
        return false;
      }
      lock.current = true;
      setBusy(true);
      setSync("Pending");
      setError("");
      const signature = JSON.stringify([target, value]);
      const command =
        retry.current?.signature === signature
          ? retry.current
          : {
              signature,
              requestId: crypto.randomUUID(),
              revision: current.current.revision,
            };
      retry.current = command;
      try {
        setSync("Syncing");
        const result = await api<{ revision?: number }>(`/api/appointments/${id}/${target}`, {
          requestId: command.requestId,
          revision: command.revision,
          ...(target === "messages" ? { message: value } : { action: value }),
        });
        ackRevision.current = result.revision ?? current.current.revision;
        if (serverRevision.current >= ackRevision.current) { setSync("Synced"); ackRevision.current = null; }
        retry.current = null;
        return true;
      } catch (err) {
        if (target === "simulation" && (value as { type?: string })?.type === "TICK" && err instanceof ApiError && err.status === 409) {
          retry.current = null; setSync("Pending"); return true;
        }
        setSync("Error");
        if (
          err instanceof ApiError &&
          [400, 403, 409, 429].includes(err.status)
        )
          retry.current = null;
        setError(errorText(err));
        return false;
      } finally {
        lock.current = false;
        setBusy(false);
      }
    },
    [id],
  );
  async function loadOlder() {
    if (historyBusy) return;
    const first = [...olderMessages, ...messages].sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id))[0];
    if (!first) return;
    setHistoryBusy(true);
    try {
      const snap = await getDocs(query(collection(getFirebaseClient().db, "appointments", id, "messages"), orderBy("createdAt", "desc"), orderBy(documentId(), "desc"), startAfter(first.createdAt, first.id), limit(40)));
      setOlderMessages((old) => [...snap.docs.map((d) => d.data() as ChatMessage), ...old]);
      setHasOlder(snap.size === 40);
    } catch (err) { setError(errorText(err)); }
    finally { setHistoryBusy(false); }
  }
  return {
    appointment,
    messages: Array.from(new Map([...olderMessages, ...messages].map((m) => [m.id, m])).values()).sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id)),
    sync,
    loadOlder,
    hasOlder,
    historyBusy,
    notices,
    run,
    loading,
    error,
    busy,
    online,
    cached,
    send,
  };
}
