# Firebase cho team chạy Next.js local

Frontend và API Next.js chạy trên máy mỗi thành viên. Firebase Auth và Firestore
dùng chung project cloud `careflow-ag`. Gemini dùng project GCP riêng trong `GCP_PROJECT_ID`.

## Cài đặt

1. Chạy `npm install`.
2. Nếu chưa có `.env.local`, copy `.env.example` thành `.env.local`. Nếu đã có,
   bổ sung biến còn thiếu; không ghi đè cấu hình riêng.
3. Trong Firebase Console bật Authentication và provider muốn dùng (ví dụ Google),
   thêm `localhost` tại Authentication > Settings > Authorized domains.
4. Tạo Firestore database `(default)`, chọn Production mode. Không cần Hosting.
5. Cấu hình credential backend theo phần dưới, rồi chạy `npm run dev`.

## Credential backend

Module admin dùng `FIREBASE_PROJECT_ID=careflow-ag`, không dùng `GCP_PROJECT_ID`.

- Nếu `FIREBASE_ADMIN_CREDENTIALS` được đặt, giá trị phải là đường dẫn đến file
  service account JSON có quyền trên `careflow-ag`. Ví dụ
  `FIREBASE_ADMIN_CREDENTIALS=./firebase-admin-private.json`. File này được gitignore.
- Nếu không đặt, SDK dùng Application Default Credentials. Biến
  `GOOGLE_APPLICATION_CREDENTIALS` trong `.env` hiện tại cũng ảnh hưởng đến Firebase.
  Tài khoản trong file đó phải được cấp quyền trên `careflow-ag`; quyền gọi Gemini
  ở project khác không tự cấp quyền Firestore.
- Với developer dùng ADC cá nhân, chạy `gcloud auth application-default login`
  sau khi được chủ project cấp quyền phù hợp (Firestore đọc/ghi: Cloud Datastore User).
  ADC cá nhân chỉ được chọn khi không có biến `GOOGLE_APPLICATION_CREDENTIALS`
  trỏ đến file khác. Không chia sẻ refresh token giữa các thành viên.

Không cần gửi private key vào chat hoặc commit vào repository.

## Dùng trong frontend

Trong Client Component hoặc sự kiện click:

```ts
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirebaseClient } from "@/lib/firebase/client";

const { auth } = getFirebaseClient();
await signInWithPopup(auth, new GoogleAuthProvider());
```

## Dùng trong backend

Trong Route Handler chạy Node.js:

```ts
import { getFirebaseAdmin } from "@/lib/firebase/admin";

const { auth, db } = getFirebaseAdmin();
// Verify a Firebase ID token from the request before accessing user data.
const { uid } = await auth.verifyIdToken(idToken);
const profile = await db.collection("users").doc(uid).get();
```

Admin SDK bỏ qua Firestore Security Rules: API phải tự xác thực và kiểm tra quyền.
Client SDK truy cập Firestore trực tiếp chịu Security Rules. Production mode mặc
định chặn truy cập trực tiếp; không mở toàn bộ database chỉ để thử kết nối.

Các module này chuẩn bị kết nối; UI chat hiện chưa có đăng nhập hoặc lưu hội thoại
vào Firestore. `initializeApp` thành công chưa chứng minh đã truy cập được database.

Kiểm tra backend bằng một lần đọc, không ghi dữ liệu (Node.js 22):

```bash
node --env-file-if-exists=.env --env-file=.env.local scripts/check-firebase.mjs
```

`connected: true` nghĩa là truy cập Firestore thành công, kể cả khi document không
tồn tại. Mã lỗi `7` thường là thiếu quyền hoặc API chưa bật; mã `5` có thể là chưa
tạo database `(default)`. Kiểm tra cấu hình Console và IAM tương ứng.

Tài liệu: https://firebase.google.com/docs/web/setup
và https://firebase.google.com/docs/admin/setup
