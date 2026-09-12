import "server-only";

import { applicationDefault, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Call only from Node.js Route Handlers or other server code.
export function getFirebaseAdmin() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("Thiếu FIREBASE_PROJECT_ID trong .env.local.");
  }

  const credentialPath = process.env.FIREBASE_ADMIN_CREDENTIALS;
  const app = getApps().some((item) => item.name === "careflow-admin")
    ? getApp("careflow-admin")
    : initializeApp(
        {
          projectId,
          credential: credentialPath ? cert(credentialPath) : applicationDefault(),
        },
        "careflow-admin",
      );

  return { app, auth: getAuth(app), db: getFirestore(app) };
}
