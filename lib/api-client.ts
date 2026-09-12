"use client";
import { getFirebaseClient } from "./firebase/client";
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number,
  ) {
    super(message);
  }
}
export async function api<T>(url: string, body?: unknown): Promise<T> {
  const user = getFirebaseClient().auth.currentUser;
  if (!user) throw new ApiError("Vui lòng đăng nhập.", "UNAUTHENTICATED", 401);
  const response = await fetch(url, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      Authorization: `Bearer ${await user.getIdToken()}`,
      "Content-Type": "application/json",
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(60000),
  });
  const result = await response.json();
  if (!response.ok || !result.success)
    throw new ApiError(
      result.error?.message || "Không thể thực hiện yêu cầu.",
      result.error?.code || "UNKNOWN",
      response.status,
    );
  return result.data as T;
}
export function errorText(error: unknown) {
  if (error instanceof ApiError) return error.message;
  const code = (error as { code?: string })?.code;
  const messages: Record<string, string> = {
    "auth/invalid-credential": "Email hoặc mật khẩu chưa đúng.",
    "auth/email-already-in-use": "Email này đã có tài khoản. Hãy đăng nhập.",
    "auth/weak-password": "Mật khẩu cần ít nhất 6 ký tự.",
    "auth/operation-not-allowed":
      "Email/Password chưa được bật trong Firebase Authentication.",
    "auth/network-request-failed":
      "Không kết nối được Firebase. Kiểm tra mạng rồi thử lại.",
    "permission-denied":
      "Chưa có quyền đọc dữ liệu. Kiểm tra tài khoản và Firestore Rules.",
    "failed-precondition":
      "Firestore cần cấu hình index. Xem hướng dẫn cài đặt demo.",
  };
  return (
    (code && messages[code]) ||
    "Không thể kết nối hoặc xử lý yêu cầu. Hãy thử lại."
  );
}
