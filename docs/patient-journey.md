# Patient journey demo

## Start on shared Firebase cloud

1. Keep the Firebase Web configuration and `FIREBASE_PROJECT_ID=careflow-ag` in `.env`.
   Keep the existing `GCP_PROJECT_ID`, Gemini model and credentials separate.
2. Enable Email/Password in Firebase Authentication. Create Firestore `(default)`.
3. Give the backend identity access to Firestore in `careflow-ag`. A credential that
   can call Gemini in another project does not automatically have this access.
4. Apply the supplied rules/indexes to your intended development project:

   ```bash
   npx firebase deploy --only firestore:rules,firestore:indexes --project careflow-ag
   ```

   Review any existing rules before replacing them. This repository's rules are for
   the demo's collections and deny other access by default.
5. Set `CAREFLOW_DEMO_MODE=true` in `.env`, run `npm run dev`, open `/login`, register
   as Patient, and choose **Tạo ca khám demo** on the dashboard.

If Firebase is still unavailable, the app shows a connection/permission error. It
does not claim to save data locally as a substitute for a successful server write.

## Run entirely with local Firebase emulators

Requires Node.js 22 and Java 21+. The emulator project is **demo-careflow**, separate
from shared cloud data. Start it using `npm run emulators`.

In a separate terminal, use these values in your local `.env` (or shell environment):

```dotenv
FIREBASE_PROJECT_ID=demo-careflow
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-careflow
NEXT_PUBLIC_FIREBASE_API_KEY=demo-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=demo-careflow.firebaseapp.com
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:demo
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
CAREFLOW_DEMO_MODE=true
```

Restart Next.js after changing environment values. Do not change the Gemini
configuration to `demo-careflow`: Gemini still calls Vertex AI with its existing
project. If `.env.local` contains duplicate keys, it takes precedence over `.env`.
Do not enable emulator variables when using shared Firebase cloud.

## Walk through the demo

1. Register using email/password. Patient and Doctor roles are fixed after profile
   creation. Doctor accounts have only a waiting page, not patient access.
2. Create a case, describe your needs in chat, review the proposed summary and
   confirm. Alternatively use **Chọn quy trình trực tiếp** if Gemini is unavailable.
3. Check in. For the checkup template, open the simulation panel and set Room A's
   queue to 6. The engine proposes imaging B before lab A. Accept or reject it.
4. Click **Tôi đã đến phòng này**, then use simulation to **Gọi số → Bắt đầu phục vụ
   → Hoàn tất thực hiện**. Investigations additionally require **Kết quả đã sẵn sàng**.
5. For dental/follow-up templates, finish the initial consultation, then choose
   **Có chỉ định demo** or **Không cần thực hiện** for each conditional branch.
   These decisions are manual simulation, not clinical recommendations by Gemini.
6. Read notifications, open the same case in another tab and reload. Persisted
   state and messages are restored. Each person's simulation is isolated by owner.

Room snapshots older than five minutes suspend route optimization. Confirm the
simulated room state again to refresh them. The simulation does not randomly
advance with a timer. Queue duration is a simple estimate from a frozen snapshot;
it is not a forecast of a real hospital's load. Completing a test requires a
separate result-ready event. A called/serving patient is not rerouted.

Support requests put the case on hold and create a ticket. No real staff receives
it in this release. Start a new case to repeat a held/finished demo; old history is
retained. All clinical content, doctors and room assignments in the fixtures are
illustrative and require hospital approval before any real use.

## Architecture and data

- JSON catalog: `config/workflows/patient-demo.json`. Zod validates IDs, references,
  default topological order, allowed node kinds and compatible alternative rooms.
- Engine: pure TypeScript operations on an appointment snapshot. Only independent
  reorder groups and equivalent rooms are optimized. Completed/called/serving
  steps stay fixed. The route remains unchanged until the patient confirms.
- Agent: bounded Gemini structured-output classification, with one retry. It
  cannot write Firestore or invoke arbitrary tools. Deterministic server code
  handles state, actions and operational guidance. Existing `/api/chat` is retained.
- API: authenticated Node.js handlers. Profile creation, case creation, messages,
  actions and simulation endpoints verify the user's ID token and ownership.
- Firestore: `users/{uid}`, `appointments/{id}` plus `messages`, `notifications`,
  `events`, `agentRuns`, `supportRequests`, `journeyVersions` subcollections.
  Numeric server timestamps are milliseconds since epoch. The case contains its
  workflow snapshot, steps, conditions, assignments and per-case room snapshot.
- Client reads use Firestore listeners with owner-only rules; business writes go
  through the backend. Internal events/history cannot be modified from the client.
  The UI displays the latest 200 messages and 50 notifications; older entries
  remain stored in Firestore.
- `requestId` deduplicates commands; revisions reject stale requests. Gemini runs
  outside transactions and its result is rejected if state changed while it ran.
  Lifecycle/audit snapshots are stored on each accepted business change.

## Verification

```bash
npm test
npm run test:emulator
npx playwright install chromium
# With npm run emulators running in another terminal:
npm run test:e2e
npm run lint
npm run build
```

`npm test` skips emulator tests unless `FIRESTORE_EMULATOR_HOST` is set.
Browser tests start a separate Next server on port 3100 with `.next-e2e` output,
using the demo emulator project. Screenshots go to `test-results/`.
No test deploys Firebase rules to the shared cloud project.
