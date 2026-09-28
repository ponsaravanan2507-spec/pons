import { Link } from 'react-router-dom';
import { useStore } from '../context/Store';
import { EXTRAS, inr, unit } from '../utils';
import EmptyState from '../components/EmptyState';
import Summary from '../components/Summary';

export default function Cart() {
  const { cart, changeQty, remove } = useStore();
  const items = Object.values(cart);
  if (!items.length) return <EmptyState emoji="🛒" title="Your cart is empty" text="Add something delicious to get started." />;
  return (
    <div style={{ paddingTop: 20 }}>
      <h2 style={{ marginBottom: 16 }}>Your cart</h2>
      <div className="two">
        <div className="panel">
          {items.map((c) => (
            <div className="item" key={c.key}>
              <div className="em">{c.emoji}</div>
              <div style={{ flex: 1 }}><b>{c.name}</b>
                <div className="meta" style={{ margin: '2px 0' }}>{c.rname} · {c.spice}{c.extras.length ? ' · ' + c.extras.map((k) => EXTRAS[k].label).join(', ') : ''}</div></div>
              <div className="qty"><button aria-label="Decrease" onClick={() => changeQty(c.key, -1)}>−</button><b>{c.qty}</b><button aria-label="Increase" onClick={() => changeQty(c.key, 1)}>+</button></div>
              <b style={{ minWidth: 64, textAlign: 'right' }}>{inr(unit(c) * c.qty)}</b>
              <button className="fav" style={{ position: 'static' }} aria-label={`Remove ${c.name}`} onClick={() => remove(c.key)}>🗑</button>
            </div>))}
        </div>
        <aside className="panel"><h3>Order summary</h3><Summary />
          <Link className="btn" to="/checkout" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: 14 }}>Checkout</Link></aside>
      </div>
    </div>
  );
}
