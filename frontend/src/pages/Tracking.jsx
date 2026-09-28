import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import EmptyState from '../components/EmptyState';

// Rider position on the map for each of the 5 stages (percent of map box).
const POS = [[12, 80], [12, 80], [30, 55], [55, 40], [88, 22]];

export default function Tracking() {
  const { id } = useParams();
  const [o, setO] = useState(null);
  const [missing, setMissing] = useState(false);

  // Poll the API; the server advances the status over time.
  useEffect(() => {
    let live = true, timer;
    const tick = () => api(`/orders/${id}`).then((d) => { if (!live) return; setO(d); if (d.status < 4) timer = setTimeout(tick, 3000); }).catch(() => live && setMissing(true));
    tick(); return () => { live = false; clearTimeout(timer); };
  }, [id]);

  if (missing) return <EmptyState emoji="📦" title="No orders yet" text="We couldn't find that order." />;
  if (!o) return <div className="skel" style={{ height: 380, marginTop: 24 }} />;
  const s = o.status, [x, y] = POS[s];
  const eta = s >= 4 ? 'Delivered. Enjoy your meal! 🎉' : `Arriving in ${Math.max(3, o.eta - s * 7)} min`;

  return (
    <div style={{ paddingTop: 20 }}>
      <div className="head"><h2>Track order</h2><b>{o.id}</b></div>
      <div className="two">
        <div className="map" role="img" aria-label="Delivery map">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M12 80 C30 80 30 30 55 40 S80 20 88 22" fill="none" stroke="#f5921e" strokeWidth=".9" strokeDasharray="2 1.5" /></svg>
          <span className="pin" style={{ left: '12%', top: '82%' }}>🍳</span><span className="pin" style={{ left: '88%', top: '26%' }}>🏠</span>
          <span id="rider" style={{ left: `${x}%`, top: `${y}%` }}>🛵</span>
        </div>
        <div className="panel">
          <h3 aria-live="polite">{eta}</h3>
          <div className="bar" style={{ margin: '12px 0' }}><div style={{ width: `${(s / 4) * 90 + 10}%` }} /></div>
          <div className="steps">{o.statuses.map((n, i) => <div key={n} className={`step ${i < s ? 'done' : i === s ? 'now' : ''}`}><i>{i < s ? '✓' : i + 1}</i>{n}</div>)}</div>
          <div className="row" style={{ borderTop: '1px solid var(--ln)', paddingTop: 12 }}>
            <span style={{ fontSize: 36 }}>🧑‍🦱</span>
            <div style={{ flex: 1 }}><b>{o.partner.name}</b><div className="meta" style={{ margin: 0 }}>⭐ {o.partner.rating} · Your delivery partner</div></div>
            <a className="btn sm" href="tel:+919999999999" style={{ textDecoration: 'none' }}>Call</a>
          </div>
        </div>
      </div>
    </div>
  );
}
