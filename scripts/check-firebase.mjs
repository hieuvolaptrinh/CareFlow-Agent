import { applicationDefault, cert, deleteApp, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Read-only check; a nonexistent document is also a successful connection.
const projectId = process.env.FIREBASE_PROJECT_ID;
if (!projectId) throw new Error("Missing FIREBASE_PROJECT_ID");
const credentialPath = process.env.FIREBASE_ADMIN_CREDENTIALS;
const app = initializeApp({
  projectId,
  credential: credentialPath ? cert(credentialPath) : applicationDefault(),
});
const timeout = setTimeout(() => {
  console.error("Firestore connection timed out after 30 seconds.");
  process.exit(1);
}, 30000);

try {
  const document = await getFirestore(app).doc("_connection_check/read_only").get();
  console.log({ connected: true, projectId, documentExists: document.exists });
} catch (error) {
  console.error({ connected: false, projectId, code: error.code ?? "unknown" });
  process.exitCode = 1;
} finally {
  clearTimeout(timeout);
  await deleteApp(app);
}
