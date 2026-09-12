import { catalog } from "@/server/workflow/catalog";

// Conservative demo keyword routing, not a clinical triage classifier.
export function checkSafetyGuardrails(userInput: string): {
  isEmergency: boolean;
  reason?: string;
} {
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");
  const lower = normalize(userInput);
  for (const flag of catalog.policy.redFlags) {
    const pattern = normalize(flag);
    for (const match of lower.matchAll(new RegExp(pattern, "g"))) {
      const before = lower.slice(Math.max(0, match.index - 35), match.index);
      if (/\b(khong|chua)( co| bi| thay)?\s*$/.test(before)) continue;
      return {
        isEmergency: true,
        reason: `Phát hiện dấu hiệu khẩn cấp: ${flag}`,
      };
    }
  }

  return { isEmergency: false };
}
