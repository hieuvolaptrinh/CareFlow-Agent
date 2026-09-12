import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "test-results/browser",
  timeout: 90000,
  expect: { timeout: 15000 },
  workers: 1,
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev -- --port 3100",
    url: "http://localhost:3100/login",
    timeout: 120000,
    reuseExistingServer: false,
    env: {
      CAREFLOW_BUILD_DIR: ".next-e2e",
      CAREFLOW_DEMO_MODE: "true",
      NEXT_PUBLIC_USE_FIREBASE_EMULATORS: "true",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "demo-careflow",
      NEXT_PUBLIC_FIREBASE_API_KEY: "demo-key",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "demo-careflow.firebaseapp.com",
      NEXT_PUBLIC_FIREBASE_APP_ID: "1:123:web:demo",
      FIREBASE_PROJECT_ID: "demo-careflow",
      FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:9099",
      FIRESTORE_EMULATOR_HOST: "127.0.0.1:8080",
      GOOGLE_APPLICATION_CREDENTIALS: "",
      FIREBASE_ADMIN_CREDENTIALS: "",
    },
  },
});
