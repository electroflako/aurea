export const FREE_SHIPPING_THRESHOLD_CENTS = 15000;
export const SHIPPING_CENTS = 690;

const priceFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatPrice(cents: number): string {
  return priceFormatter.format(cents / 100);
}

export function shippingFor(subtotalCents: number): number {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_CENTS;
}
