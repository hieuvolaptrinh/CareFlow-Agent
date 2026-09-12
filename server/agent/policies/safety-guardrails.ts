/**
 * Hospital Safety & Red Flag Rules Check
 */
export function checkSafetyGuardrails(userInput: string): {
  isEmergency: boolean;
  reason?: string;
} {
  const redFlags = [
    "đau ngực dữ dội",
    "khó thở",
    "bất tỉnh",
    "chảy máu xối xả",
    "co giật",
  ];

  const lower = userInput.toLowerCase();
  for (const flag of redFlags) {
    if (lower.includes(flag)) {
      return { isEmergency: true, reason: `Phát hiện dấu hiệu khẩn cấp: ${flag}` };
    }
  }

  return { isEmergency: false };
}
