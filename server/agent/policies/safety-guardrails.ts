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
  for (const flag of [...catalog.policy.redFlags, "khó nuốt", "sưng lan nhanh", "chảy máu không cầm"]) {
    const pattern = normalize(flag);
    for (const match of lower.matchAll(new RegExp(pattern, "g"))) {
      const before = lower.slice(Math.max(0, match.index - 35), match.index);
      if (/\b(khong|chua)( co| bi| thay)?\s*$/.test(before)) continue;
      const clause = lower.slice(Math.max(lower.lastIndexOf(".", match.index), lower.lastIndexOf(";", match.index)) + 1, lower.indexOf(".", match.index) < 0 ? undefined : lower.indexOf(".", match.index));
      if (/(truoc day|nam ngoai|tuan truoc)/.test(clause) && /(hien|gio|nay).*(het|binh thuong|khong con)/.test(clause)) continue;
      return {
        isEmergency: true,
        reason: `Phát hiện dấu hiệu khẩn cấp: ${flag}`,
      };
    }
  }

  return { isEmergency: false };
}
