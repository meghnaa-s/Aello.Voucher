export function formatVoucherDate(iso: string): string {
  const d = new Date(iso);
  return d
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .toUpperCase();
}

export function formatPrice(price: number, currency: string): string {
  return `${currency} ${price.toFixed(3)}`;
}
