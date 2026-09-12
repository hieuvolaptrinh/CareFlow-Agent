"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const connected = new WeakSet<object>();

export function getFirebaseClient() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (!config.apiKey || !config.projectId || !config.appId) {
    throw new Error("Thiếu cấu hình Firebase Web trong .env.local.");
  }

  const app = getApps().some((item) => item.name === "careflow-web")
    ? getApp("careflow-web")
    : initializeApp(config, "careflow-web");

  const auth = getAuth(app), db = getFirestore(app);
  if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true" && !connected.has(app)) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    connected.add(app);
  }
  return { app, auth, db };
}
