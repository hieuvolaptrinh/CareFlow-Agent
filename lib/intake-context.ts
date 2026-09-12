import type { IntakeContext } from "@/types/journey";

export const dentalFields = {
  need: "Nhu cầu khám",
  location: "Vị trí khó chịu",
  onset: "Bắt đầu khi nào",
  course: "Diễn biến",
  severity: "Mức độ đau tự đánh giá",
  pattern: "Liên tục hay từng lúc",
  triggers: "Điều làm đau tăng",
  impact: "Ảnh hưởng ăn uống / ngủ",
  swelling: "Sưng",
  fever: "Sốt",
  bleeding: "Chảy máu",
  mouthOpening: "Khả năng há miệng",
  swallowing: "Khả năng nuốt",
  breathing: "Hô hấp",
  history: "Xử lý răng / lần khám trước",
  medications: "Thuốc đang dùng",
  allergies: "Dị ứng",
  conditions: "Bệnh nền đã biết",
  age: "Tuổi tự khai (không bắt buộc)",
} as const;
export type DentalField = keyof typeof dentalFields;
export const dentalQuestions: Record<DentalField, string> = {
  need: "Bạn muốn khám mới, tái khám nha khoa hay kiểm tra răng định kỳ?",
  location: "Bạn khó chịu ở vị trí nào?",
  onset: "Tình trạng bắt đầu từ khi nào?",
  course: "Từ khi bắt đầu, tình trạng đang tăng, giảm hay không đổi?",
  severity: "Bạn tự đánh giá đau ở mức nào từ 0 đến 10?",
  pattern: "Đau liên tục hay từng lúc?",
  triggers: "Điều gì làm khó chịu tăng, như nhai hoặc đồ nóng/lạnh?",
  impact: "Tình trạng ảnh hưởng ăn uống hoặc giấc ngủ thế nào?",
  swelling: "Bạn có sưng ở nướu, mặt hoặc cổ không?",
  fever: "Bạn có sốt không?",
  bleeding: "Bạn có chảy máu vùng răng/nướu không?",
  mouthOpening: "Bạn há miệng bình thường hay gặp khó khăn?",
  swallowing: "Hiện bạn nuốt bình thường hay khó nuốt?",
  breathing: "Hiện bạn thở bình thường hay khó thở?",
  history: "Bạn từng xử lý răng ở vùng này hoặc có thông tin lần khám trước không? Không nhớ cũng có thể nói rõ nhé.",
  medications: "Bạn đang dùng thuốc gì, hoặc chưa dùng thuốc?",
  allergies: "Bạn có dị ứng nào đã biết không?",
  conditions: "Bạn có bệnh nền nào đã biết không?",
  age: "Bạn có muốn cho biết tuổi không?",
};
export const dentalWorkflowIds = ["dental-pain", "dental-gum", "dental-followup", "dental-routine"] as const;
export function emptyIntakeContext(): IntakeContext {
  return { mode: "DENTAL", version: 0, facts: {}, workflowId: null, missing: ["need"], summary: "", confirmedVersion: null, safety: "UNCLEAR" };
}
export function contextMissing(context: IntakeContext): DentalField[] {
  // Keep the chat intake short: these are the only three prompts required
  // before proposing a journey. Other fields remain optional and are still
  // extracted when the patient volunteers them or uses the detailed form.
  const required: DentalField[] = ["need", "breathing", "swallowing"];
  return required.filter((key) => !context.facts[key]);
}
export function contextSummary(context: IntakeContext): string {
  return Object.entries(dentalFields).flatMap(([key, label]) => {
    const fact = context.facts[key];
    if (!fact) return [];
    return [`${label}: ${fact.status === "UNKNOWN" ? "Chưa biết — " : fact.status === "DECLINED" ? "Không cung cấp — " : ""}${fact.value}`];
  }).join("\n");
}
