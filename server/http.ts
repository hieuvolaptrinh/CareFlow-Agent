import "server-only";
import { z } from "zod";
import { getFirebaseAdmin } from "@/lib/firebase/admin";
import type { Profile } from "@/types/journey";
import { JourneyError } from "@/server/workflow/engine";

export async function authenticate(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer "))
    throw new JourneyError("Vui lòng đăng nhập.", 401, "UNAUTHENTICATED");
  try {
    return await getFirebaseAdmin().auth.verifyIdToken(header.slice(7));
  } catch {
    throw new JourneyError(
      "Phiên đăng nhập không hợp lệ. Hãy đăng nhập lại.",
      401,
      "UNAUTHENTICATED",
    );
  }
}
export async function requirePatient(request: Request) {
  const token = await authenticate(request);
  const profile = (
    await getFirebaseAdmin().db.collection("users").doc(token.uid).get()
  ).data() as Profile | undefined;
  if (profile?.role !== "PATIENT")
    throw new JourneyError(
      "Chức năng này dành cho tài khoản bệnh nhân.",
      403,
      "FORBIDDEN",
    );
  return token.uid;
}
export async function parseBody<T>(
  request: Request,
  schema: z.ZodType<T>,
): Promise<T> {
  const body = await request.text();
  if (body.length > 16000)
    throw new JourneyError("Nội dung quá dài.", 413, "TOO_LARGE");
  try {
    return schema.parse(JSON.parse(body));
  } catch {
    throw new JourneyError(
      "Dữ liệu gửi lên không hợp lệ.",
      400,
      "INVALID_INPUT",
    );
  }
}
export async function endpoint(fn: () => Promise<unknown>, status = 200) {
  try {
    return Response.json(
      { success: true, data: await fn() },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof z.ZodError)
      return Response.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Định danh hoặc dữ liệu không hợp lệ.",
          },
        },
        { status: 400 },
      );
    if (error instanceof JourneyError)
      return Response.json(
        { success: false, error: { code: error.code, message: error.message } },
        { status: error.status },
      );
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String(error.code)
        : "UNKNOWN";
    console.error("CareFlow request failed", { code });
    return Response.json(
      {
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message:
            "Chưa thể lưu hoặc tải dữ liệu. Kiểm tra kết nối và cấu hình Firebase rồi thử lại.",
        },
      },
      { status: 503 },
    );
  }
}
