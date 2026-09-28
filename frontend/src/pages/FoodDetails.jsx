import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '../hooks';
import { useStore } from '../context/Store';
import { EXTRAS, inr } from '../utils';
import Visual from '../components/Visual';
import VegDot from '../components/VegDot';
import EmptyState from '../components/EmptyState';

export default function FoodDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { add } = useStore();
  const { data: f, loading, error } = useFetch(`/foods/${id}`);
  const [qty, setQty] = useState(1);
  const [extras, setExtras] = useState([]);
  const [spice, setSpice] = useState('Medium');

  if (loading) return <div className="skel" style={{ height: 420, marginTop: 24 }} />;
  if (error) return <EmptyState emoji="🤔" title="Dish not found" text="Let's find you something tasty." />;
  const unitPrice = f.price + extras.reduce((a, k) => a + EXTRAS[k].price, 0);
  const toggle = (k) => setExtras((e) => (e.includes(k) ? e.filter((x) => x !== k) : [...e, k]));
  const submit = (buyNow) => { add(f, { qty, extras, spice }); if (buyNow) nav('/checkout'); };

  return (
    <div className="two" style={{ paddingTop: 24 }}>
      <div className="card" style={{ cursor: 'default' }}><div className="img" style={{ background: f.tint, height: 'min(60vw,420px)', fontSize: 'min(30vw,200px)' }}><Visual item={f} /></div></div>
      <div className="panel">
        <div className="row"><h1 style={{ fontSize: 'clamp(26px,4vw,38px)' }}>{f.name}</h1><VegDot veg={f.veg} /></div>
        <p className="meta"><Link to={`/restaurant/${f.rid}`}>{f.rname}</Link><span>⭐ 4.5</span></p>
        <p>{f.description}</p>
        <h3 style={{ margin: '16px 0 6px' }}>Ingredients</h3>
        <p className="meta">{f.ingredients.join(' · ')}</p>
        <h3 style={{ margin: '16px 0 6px' }}>Customize</h3>
        <label className="field">Spice level
          <select value={spice} onChange={(e) => setSpice(e.target.value)} className="tools" style={{ padding: 10, borderRadius: 12, border: '1.5px solid var(--ln)', background: 'var(--bg)' }}>
            {['Mild', 'Medium', 'Hot'].map((s) => <option key={s}>{s}</option>)}</select></label>
        {Object.entries(EXTRAS).map(([k, x]) => (
          <label key={k} className="opt"><span><input type="checkbox" checked={extras.includes(k)} onChange={() => toggle(k)} /> {x.label}</span><span>+{inr(x.price)}</span></label>))}
        <div className="row" style={{ margin: '18px 0' }}>
          <div className="qty"><button aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}>−</button><b aria-live="polite">{qty}</b><button aria-label="Increase quantity" onClick={() => setQty(qty + 1)}>+</button></div>
          <b style={{ fontSize: 22 }}>{inr(unitPrice * qty)}</b>
        </div>
        <div className="sp"><button className="btn" onClick={() => submit(false)}>Add to cart</button><button className="btn ghost" onClick={() => submit(true)}>Buy now</button></div>
      </div>
    </div>
  );
}
