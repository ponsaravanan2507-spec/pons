import { useState } from 'react';
import { api } from '../api';
import { useStore } from '../context/Store';
import { inr } from '../utils';

// Coupon box + price breakdown, shared by Cart and Checkout.
export default function Summary() {
  const { totals: t, coupon, setCoupon, notify } = useStore();
  const [code, setCode] = useState(coupon?.code || '');
  const [err, setErr] = useState('');
  const apply = async () => {
    try { setCoupon(await api(`/coupons/${code.trim()}`)); setErr(''); notify('🎉 Coupon applied'); }
    catch (e) { setCoupon(null); setErr(e.message); }
  };
  return (
    <>
      <div className="coup">
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" aria-label="Coupon code" />
        <button className="btn sm" onClick={apply}>Apply</button>
      </div>
      {coupon ? <span className="ok">✓ {coupon.code} applied – {coupon.note}</span> : err ? <span className="err">{err}</span> : <span className="meta">Try WELCOME50, FOOD20 or FIRSTORDER</span>}
      <div style={{ marginTop: 10 }}>
        <div className="tot"><span>Subtotal</span><span>{inr(t.sub)}</span></div>
        <div className="tot"><span>Delivery</span><span>{inr(t.fee)}</span></div>
        <div className="tot"><span>Taxes (5%)</span><span>{inr(t.tax)}</span></div>
        {t.disc > 0 && <div className="tot ok"><span>Discount</span><span>−{inr(t.disc)}</span></div>}
        <div className="tot g"><span>Total</span><span>{inr(t.total)}</span></div>
      </div>
    </>
  );
}
