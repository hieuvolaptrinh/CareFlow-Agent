"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { getFirebaseClient } from "@/lib/firebase/client";
import { api, errorText } from "@/lib/api-client";
import type { Profile } from "@/types/journey";

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string;
  reload: () => Promise<Profile | null>;
  logout: () => Promise<void>;
}
const Context = createContext<AuthState | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null),
    [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const reload = async () => {
    const result = await api<Profile | null>("/api/profile");
    setProfile(result);
    setError("");
    return result;
  };
  useEffect(() => {
    let active = true,
      generation = 0;
    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(
        getFirebaseClient().auth,
        async (current) => {
          const version = ++generation;
          setUser(current);
          setProfile(null);
          setError("");
          setLoading(true);
          try {
            const result = current
              ? await api<Profile | null>("/api/profile")
              : null;
            if (active && version === generation) setProfile(result);
          } catch (err) {
            if (active && version === generation) setError(errorText(err));
          } finally {
            if (active && version === generation) setLoading(false);
          }
        },
      );
    } catch {
      queueMicrotask(() => {
        if (active) {
          setError("Thiếu cấu hình Firebase. Hãy kiểm tra .env.");
          setLoading(false);
        }
      });
    }
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);
  return (
    <Context.Provider
      value={{
        user,
        profile,
        loading,
        error,
        reload,
        logout: () => signOut(getFirebaseClient().auth),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAuth() {
  const state = useContext(Context);
  if (!state) throw new Error("AuthProvider missing");
  return state;
}
