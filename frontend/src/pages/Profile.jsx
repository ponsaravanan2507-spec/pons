import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useFetch } from '../hooks';
import { useStore } from '../context/Store';
import { inr } from '../utils';
import EmptyState from '../components/EmptyState';
import RestaurantCard from '../components/RestaurantCard';

const TABS = ['Profile', 'Addresses', 'Orders', 'Favorites', 'Payments', 'Settings'];

export default function Profile() {
  const { user, setUser, logout, favs, notify, dark, setDark } = useStore();
  const nav = useNavigate();
  const [tab, setTab] = useState('Profile');
  const [orders, setOrders] = useState(null);
  const { data: rests } = useFetch('/restaurants');
  const [form, setForm] = useState({ name: '', phone: '' });
  const [addr, setAddr] = useState({ label: 'Home', text: '' });

  useEffect(() => { if (user) { setForm({ name: user.name, phone: user.phone }); api('/orders').then(setOrders).catch(() => setOrders([])); } }, [user]);
  if (!user) return <EmptyState emoji="🔐" title="Log in to see your profile" text="Your orders, addresses and favorites live here." cta="Log in" to="/login" />;

  const saveInfo = async () => { setUser(await api('/me', { method: 'PUT', body: form })); notify('✓ Profile updated'); };
  const addAddress = async () => { try { const a = await api('/addresses', { method: 'POST', body: addr }); setUser({ ...user, addresses: a }); setAddr({ label: 'Home', text: '' }); notify('✓ Address saved'); } catch (e) { notify(e.message); } };
  const delAddress = async (id) => setUser({ ...user, addresses: await api(`/addresses/${id}`, { method: 'DELETE' }) });
  const favRests = rests?.filter((r) => favs.includes(r.id)) || [];

  return (
    <div style={{ paddingTop: 20 }}>
      <div className="head"><h2>Hi, {user.name.split(' ')[0]} 👋</h2><button className="btn ghost sm" onClick={() => { logout(); nav('/'); }}>Log out</button></div>
      <div className="tabs" role="tablist">{TABS.map((t) => <button key={t} role="tab" aria-selected={tab === t} className={`chip ${tab === t ? 'on' : ''}`} onClick={() => setTab(t)}>{t}</button>)}</div>

      {tab === 'Profile' && <div className="panel" style={{ maxWidth: 480 }}>
        <label className="field">Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label className="field">Email<input value={user.email} disabled /></label>
        <label className="field">Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
        <button className="btn" onClick={saveInfo}>Save changes</button></div>}

      {tab === 'Addresses' && <div className="two"><div className="panel">{user.addresses.length === 0 ? <p className="meta">No saved addresses yet.</p> : user.addresses.map((a) =>
        <div className="item" key={a.id}><div className="em">📍</div><div style={{ flex: 1 }}><b>{a.label}</b><div className="meta" style={{ margin: 0 }}>{a.text}</div></div><button className="fav" style={{ position: 'static' }} aria-label={`Delete ${a.label} address`} onClick={() => delAddress(a.id)}>🗑</button></div>)}</div>
        <div className="panel"><h3>Add address</h3><div className="f" style={{ marginTop: 10 }}><input aria-label="Label" value={addr.label} onChange={(e) => setAddr({ ...addr, label: e.target.value })} /><textarea rows="3" aria-label="Address" placeholder="Street, area, city, PIN" value={addr.text} onChange={(e) => setAddr({ ...addr, text: e.target.value })} /></div><button className="btn" onClick={addAddress}>Save address</button></div></div>}

      {tab === 'Orders' && (orders === null ? <div className="skel" /> : orders.length === 0
        ? <EmptyState emoji="📦" title="No orders yet" text="Your placed orders will show up here." />
        : <div className="panel">{orders.map((o) => <div className="item" key={o.id}><div className="em">{o.lines[0].emoji}</div>
          <div style={{ flex: 1 }}><b>{o.restaurant}</b><div className="meta" style={{ margin: 0 }}>{o.id} · {o.lines.length} item(s) · {new Date(o.createdAt).toLocaleString('en-IN')}</div></div>
          <b>{inr(o.total)}</b><Link className="btn sm" to={`/track/${o.id}`} style={{ textDecoration: 'none' }}>{o.status >= 4 ? 'Details' : 'Track'}</Link></div>)}</div>)}

      {tab === 'Favorites' && (favRests.length === 0
        ? <EmptyState emoji="💔" title="No favorites yet" text="Tap the heart on any restaurant to save it here." />
        : <div className="grid">{favRests.map((r) => <RestaurantCard key={r.id} r={r} />)}</div>)}

      {tab === 'Payments' && <div className="panel" style={{ maxWidth: 480 }}>
        {[['📱', 'UPI', 'karthik@okbank'], ['💳', 'Visa •••• 4242', 'Expires 08/28'], ['💵', 'Cash on delivery', 'Pay at your door']].map(([e, t, s]) =>
          <div className="item" key={t}><div className="em">{e}</div><div><b>{t}</b><div className="meta" style={{ margin: 0 }}>{s}</div></div></div>)}</div>}

      {tab === 'Settings' && <div className="panel" style={{ maxWidth: 480 }}>
        <label className="opt"><span>Dark mode</span><input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} /></label>
        <label className="opt"><span>Order updates by SMS</span><input type="checkbox" defaultChecked /></label>
        <label className="opt"><span>Offers and news</span><input type="checkbox" /></label></div>}
    </div>
  );
}
