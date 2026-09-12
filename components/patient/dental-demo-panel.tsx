"use client";
import { useEffect, useRef } from "react";
import type { Appointment } from "@/types/journey";

type Send = (target: "simulation", value: unknown) => Promise<boolean>;
const STEP_INTERVAL_MS = 2500;
export function useDemoClock(
  a: Appointment | null,
  send: Send,
  disabled: boolean,
  error: string
) {
  const latest = useRef({ a, send, disabled, error });
  useEffect(() => {
    latest.current = { a, send, disabled, error };
  }, [a, send, disabled, error]);
  useEffect(() => {
    let inFlight = false;
    let localNotBefore = Date.now() + STEP_INTERVAL_MS;
    const visibility = () => {
      localNotBefore = Date.now() + STEP_INTERVAL_MS;
    };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("online", visibility);
    const timer = setInterval(async () => {
      const state = latest.current;
      const run = state.a?.simulationRun;
      if (
        inFlight ||
        document.visibilityState !== "visible" ||
        !navigator.onLine ||
        state.disabled ||
        state.error ||
        run?.status !== "RUNNING" ||
        Date.now() < Math.max(localNotBefore, run.nextTickAt)
      )
        return;
      inFlight = true;
      try {
        await state.send("simulation", { type: "TICK" });
      } finally {
        inFlight = false;
        localNotBefore = Date.now() + 900;
      }
    }, 1000);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("online", visibility);
    };
  }, []);
}
