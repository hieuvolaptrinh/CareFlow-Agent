"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { toast } from "sonner";
import { getFirebaseClient } from "@/lib/firebase/client";
import { api, ApiError, errorText } from "@/lib/api-client";
import type {
  AgentRun,
  Appointment,
  ChatMessage,
  Notice,
} from "@/types/journey";

export function useAppointment(id: string) {
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
              limit(200),
            ),
            (snap) =>
              setMessages(
                snap.docs.map((d) => d.data() as ChatMessage).reverse(),
              ),
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
        setError("Bạn đang ngoại tuyến. Nội dung chưa được gửi.");
        return false;
      }
      lock.current = true;
      setBusy(true);
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
        await api(`/api/appointments/${id}/${target}`, {
          requestId: command.requestId,
          revision: command.revision,
          ...(target === "messages" ? { message: value } : { action: value }),
        });
        retry.current = null;
        return true;
      } catch (err) {
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
  return {
    appointment,
    messages,
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
