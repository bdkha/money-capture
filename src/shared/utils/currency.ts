export function formatVND(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}tr`;
  if (amount >= 1_000) return `${Math.round(amount / 1_000)}k`;
  return `${amount}đ`;
}
