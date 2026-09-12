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
test("patient completes persistent journey, confirms replanning, uses two tabs and mobile", async ({
  page,
  context,
}) => {
  await signup(page);
  await expect(page).toHaveURL(/patient\/dashboard/);
  await page.getByRole("button", { name: "Tạo ca khám demo" }).click();
  await expect(page).toHaveURL(/patient\/appointments\//);
  await page
    .getByText("Chọn quy trình trực tiếp / khi AI chưa sẵn sàng")
    .click();
  await page
    .getByRole("combobox", { name: "Quy trình demo", exact: true })
    .selectOption("checkup");
  await page
    .getByLabel("Nhu cầu khám / thông tin tái khám")
    .fill("Tôi muốn khám sức khỏe theo gói demo.");
  await page
    .getByRole("button", { name: "Tạo bản tóm tắt để xác nhận" })
    .click();
  await page.getByRole("button", { name: "Xác nhận & lập hành trình" }).click();
  await page.getByRole("button", { name: "Tôi đã đến · Check-in" }).click();
  await page
    .getByText("Bảng mô phỏng · chỉ ảnh hưởng ca này", { exact: true })
    .click();
  const lab = page
    .locator("form")
    .filter({
      has: page.getByRole("heading", {
        name: "Phòng A · Xét nghiệm",
        exact: true,
      }),
    });
  await lab.getByLabel("Số lượt chờ").fill("6");
  await lab.getByRole("button", { name: "Áp dụng mô phỏng" }).click();
  await expect(
    page.getByRole("region", { name: "Đề xuất đổi lộ trình" }),
  ).toBeVisible();
  const other = await context.newPage();
  await other.goto(page.url());
  await expect(
    other.getByRole("region", { name: "Đề xuất đổi lộ trình" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Đồng ý đổi" }).click();
  await expect(
    other.getByRole("region", { name: "Đề xuất đổi lộ trình" }),
  ).toHaveCount(0);
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
  await page.setViewportSize({ width: 1440, height: 1080 });
  for (const name of [
    "Chẩn đoán hình ảnh theo chỉ định",
    "Xét nghiệm theo chỉ định",
    "Tổng hợp kết quả",
  ]) {
    await page.getByRole("button", { name: "Tôi đã đến phòng này" }).click();
    await page.getByRole("button", { name: "Gọi số", exact: true }).click();
    await page
      .getByRole("button", { name: "Bắt đầu phục vụ", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Hoàn tất thực hiện", exact: true })
      .click();
    if (name !== "Tổng hợp kết quả")
      await page
        .getByRole("button", { name: "Kết quả đã sẵn sàng", exact: true })
        .click();
  }
  await expect(
    page.getByRole("heading", { name: "Hành trình đã hoàn tất" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Hành trình đã hoàn tất" }),
  ).toBeVisible();
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
