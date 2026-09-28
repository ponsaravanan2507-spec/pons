export const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
export const EXTRAS = { cheese: { label: 'Extra cheese', price: 30 }, sauce: { label: 'Extra sauce', price: 15 }, sides: { label: 'Add fries', price: 60 } };
export const unit = (i) => i.price + i.extras.reduce((a, k) => a + EXTRAS[k].price, 0);

// Mirrors the server's price maths (server remains the source of truth on order).
export function calc(cart, coupon) {
  const items = Object.values(cart);
  const sub = items.reduce((a, i) => a + unit(i) * i.qty, 0);
  const fee = [...new Map(items.map((i) => [i.rid, i.fee])).values()].reduce((a, f) => a + f, 0);
  let disc = 0;
  if (coupon) disc = coupon.type === 'flat' ? coupon.value : Math.min(coupon.cap || 100, (sub * coupon.value) / 100);
  disc = Math.min(disc, sub);
  const tax = (sub - disc) * 0.05;
  return { sub, fee, disc, tax, total: sub - disc + fee + tax };
}
