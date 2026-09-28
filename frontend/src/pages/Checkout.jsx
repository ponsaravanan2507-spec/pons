import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useStore } from '../context/Store';
import { inr, unit } from '../utils';
import EmptyState from '../components/EmptyState';
import Summary from '../components/Summary';

export default function Checkout() {
  const { cart, coupon, user, clearCart } = useStore();
  const nav = useNavigate();
  const items = Object.values(cart);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.addresses?.[0]?.text || '' });
  const [payment, setPayment] = useState('UPI');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  if (!items.length) return <EmptyState emoji="🛒" title="Nothing to check out" text="Add items to your cart first." />;

  const on = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const place = async () => {
    if (!form.name || !form.phone || !form.address) return setErr('Please fill in your name, phone and delivery address.');
    setBusy(true); setErr('');
    try {
      const order = await api('/orders', { method: 'POST', body: {
        items: items.map((i) => ({ id: i.id, qty: i.qty, extras: i.extras, spice: i.spice })),
        coupon: coupon?.code, address: form.address, phone: form.phone, payment } });
      clearCart(); nav(`/order/${order.id}`);
    } catch (e) { setErr(e.message); setBusy(false); }
  };

  return (
    <div style={{ paddingTop: 20 }}>
      <h2 style={{ marginBottom: 16 }}>Checkout</h2>
      <div className="two">
        <div className="panel">
          <h3>Delivery details</h3>
          <div className="f" style={{ marginTop: 12 }}>
            {user?.addresses?.length > 0 && <select aria-label="Saved addresses" onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ padding: 11, borderRadius: 12, border: '1.5px solid var(--ln)', background: 'var(--bg)' }}>
              <option value="">Use a saved address…</option>{user.addresses.map((a) => <option key={a.id} value={a.text}>{a.label}: {a.text}</option>)}</select>}
            <input placeholder="Full name" aria-label="Full name" value={form.name} onChange={on('name')} />
            <input placeholder="Phone number" aria-label="Phone number" value={form.phone} onChange={on('phone')} />
            <textarea rows="3" placeholder="Delivery address" aria-label="Delivery address" value={form.address} onChange={on('address')} />
          </div>
          <h3>Payment method</h3>
          <div className="pay" style={{ marginTop: 12 }}>
            {[['UPI', '📱 UPI'], ['Card', '💳 Card'], ['Cash', '💵 Cash']].map(([v, l]) => <label key={v}><input type="radio" name="pay" checked={payment === v} onChange={() => setPayment(v)} />{l}</label>)}
          </div>
        </div>
        <aside className="panel">
          <h3>Order summary</h3>
          {items.map((c) => <div className="tot" key={c.key}><span>{c.qty} × {c.name}</span><span>{inr(unit(c) * c.qty)}</span></div>)}
          <Summary />
          {err && <p className="err" role="alert">{err}</p>}
          <button className="btn" style={{ width: '100%', marginTop: 14 }} disabled={busy} onClick={place}>{busy ? <><span className="spin" /> Placing order…</> : 'Place order'}</button>
        </aside>
      </div>
    </div>
  );
}
