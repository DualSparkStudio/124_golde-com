/**
 * Computes GST amount and total order amount.
 *
 * @param subtotal     - Sum of all item prices (before tax/shipping)
 * @param shippingCost - Flat shipping cost
 * @param gstRate      - GST rate as a decimal (e.g. 0.03 for 3%)
 * @returns gstAmount and totalAmount, both rounded to 2 decimal places
 */
export function computeOrderTotal(
  subtotal: number,
  shippingCost: number,
  gstRate: number,
): { gstAmount: number; totalAmount: number } {
  const gstAmount = Math.round(subtotal * gstRate * 100) / 100;
  const totalAmount = Math.round((subtotal + shippingCost + gstAmount) * 100) / 100;
  return { gstAmount, totalAmount };
}
