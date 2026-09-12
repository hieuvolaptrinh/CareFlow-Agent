import { test, expect, type Page } from "@playwright/test";

async function signup(page: Page, role: "Bệnh nhân" | "Bác sĩ" = "Bệnh nhân") {
  await page.goto("/login");
  await page
    .getByRole("button", { name: "Chưa có tài khoản? Đăng ký nhanh" })
    .click();
  await page.getByLabel("Họ và tên").fill("Người dùng demo");
  await page.getByLabel(role, { exact: true }).check();
  await page
    .getByLabel("Email", { exact: true })
    .fill(`demo-${crypto.randomUUID()}@careflow.test`);
  await page.getByLabel("Mật khẩu", { exact: true }).fill("careflow-demo-123");
  await page.getByRole("button", { name: "Đăng ký", exact: true }).click();
}

test("dashboard starts Agent directly and retries without creating a second case", async ({ page }) => {
  await signup(page);
  await expect(page).toHaveURL(/patient\/dashboard/);
  const requestIds: string[] = [];
  let appointmentId = "";
  await page.route("**/api/appointments", async (route) => {
    requestIds.push(route.request().postDataJSON().requestId);
    const response = await route.fetch();
    expect(response.status()).toBe(201);
    const result = await response.json();
    if (!appointmentId) appointmentId = result.data.id;
    expect(result.data.id).toBe(appointmentId);
    if (requestIds.length === 1) {
      await route.fulfill({ status: 503, json: { success: false, error: { code: "SERVICE_UNAVAILABLE", message: "Kết nối bị gián đoạn. Hãy thử lại." } } });
    } else {
      await route.fulfill({ response });
    }
  });
  await page.setViewportSize({ width: 390, height: 844 });
  const start = page.getByRole("button", { name: "Bắt đầu khám nha khoa", exact: true });
  await expect(start).toBeVisible();
  await page.screenshot({ path: "test-results/start-agent-mobile.png", fullPage: false });
  await start.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("region", { name: "Bắt đầu hành trình nha khoa" }).getByRole("alert")).toContainText("Kết nối bị gián đoạn");
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.screenshot({ path: "test-results/start-agent-desktop.png", fullPage: false });
  await page.getByRole("button", { name: "Thử lại · Bắt đầu khám", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/patient/appointments/${appointmentId}$`));
  expect(requestIds).toHaveLength(2);
  expect(requestIds[0]).toBe(requestIds[1]);
  await expect(page.getByText("Chào bạn! Bạn muốn khám mới", { exact: false })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Chào bạn! Bạn muốn khám mới", { exact: false })).toBeVisible();
});
test("patient appointment keeps staff simulation controls hidden on desktop and mobile", async ({
  page,
  context,
}) => {
  await signup(page);
  await expect(page).toHaveURL(/patient\/dashboard/);
  await page.getByRole("button", { name: "Ẩn thanh bên", exact: true }).click();
  await expect(page.locator("#patient-sidebar")).toBeHidden();
  await page.getByRole("button", { name: "Mở thanh bên", exact: true }).click();
  await expect(page.locator("#patient-sidebar")).toBeVisible();
  await page.getByRole("button", { name: "Bắt đầu khám nha khoa", exact: true }).click();
  await expect(page).toHaveURL(/patient\/appointments\//);
  await expect(page.getByText("Bảng mô phỏng", { exact: false })).toHaveCount(0);
  await expect(page.getByText("Điều khiển demo", { exact: false })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Mô phỏng:/ })).toHaveCount(0);
  const other = await context.newPage();
  await other.goto(page.url());
  await expect(other.getByText("Chào bạn! Bạn muốn khám mới", { exact: false })).toBeVisible();
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.screenshot({
    path: "test-results/journey-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.getByRole("tab", { name: "Hành trình" }).click();
  await page.screenshot({
    path: "test-results/journey-tablet.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("tab", { name: "Hành trình" })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/journey-mobile.png",
    fullPage: true,
  });
  await context.setOffline(true);
  await expect(page.getByText("Ngoại tuyến", { exact: true })).toBeVisible();
  await context.setOffline(false);
});
test("doctor has only waiting page; unauthenticated API is denied", async ({
  page,
  request,
}) => {
  await signup(page, "Bác sĩ");
  await expect(page).toHaveURL(/staff\/dashboard/);
  await expect(
    page.getByText("Màn hình nghiệp vụ bác sĩ sẽ được bổ sung sau.", {
      exact: false,
    }),
  ).toBeVisible();
  await page.goto("/patient/dashboard");
  await expect(
    page.getByText("Trang này không thuộc vai trò của bạn."),
  ).toBeVisible();
  const response = await request.post("/api/appointments", {
    data: { requestId: crypto.randomUUID() },
  });
  expect(response.status()).toBe(401);
});
