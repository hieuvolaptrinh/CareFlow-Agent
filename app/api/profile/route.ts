import { z } from "zod";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import { authenticate, endpoint, parseBody } from "@/server/http";
import { JourneyError } from "@/server/workflow/engine";
export const runtime = "nodejs";

export async function GET(request: Request) {
  return endpoint(async () => {
    const token = await authenticate(request);
    const profile = await getFirebaseAdmin()
      .db.collection("users")
      .doc(token.uid)
      .get();
    return profile.exists ? profile.data() : null;
  });
}
export async function POST(request: Request) {
  return endpoint(async () => {
    const token = await authenticate(request);
    const input = await parseBody(
      request,
      z.object({
        name: z.string().trim().min(1).max(80),
        role: z.enum(["PATIENT", "DOCTOR"]),
      }),
    );
    if (!token.email) throw new JourneyError("Tài khoản cần có email.");
    const ref = getFirebaseAdmin().db.collection("users").doc(token.uid);
    return getFirebaseAdmin().db.runTransaction(async (tx) => {
      const old = await tx.get(ref);
      if (old.exists) return old.data();
      const profile = {
        uid: token.uid,
        email: token.email,
        name: input.name,
        role: input.role,
      };
      tx.create(ref, profile);
      return profile;
    });
  });
}
