import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useFetch } from '../hooks';
import RestaurantCard from '../components/RestaurantCard';
import FoodCard from '../components/FoodCard';
import Reveal from '../components/Reveal';
import { CardSkeletons } from '../components/Skeleton';
import { useStore } from '../context/Store';

const REVIEWS = [['Priya', 'Ghee podi idli reached hot in 20 minutes. Unreal.'], ['Arjun', 'Tracking is spot on. My biryani was at the door as promised.'], ['Meera', 'The dessert box arrived perfectly packed. Ordering again.']];

export default function Home() {
  const nav = useNavigate();
  const { notify } = useStore();
  const { data: cats } = useFetch('/categories');
  const { data: rests, loading } = useFetch('/restaurants');
  const [q, setQ] = useState('');
  const [sugg, setSugg] = useState([]);

  // debounced search suggestions from the API
  useEffect(() => {
    if (!q.trim()) return setSugg([]);
    const t = setTimeout(() => api(`/suggest?q=${encodeURIComponent(q)}`).then(setSugg).catch(() => {}), 200);
    return () => clearTimeout(t);
  }, [q]);

  const trending = rests ? rests.flatMap((r) => r.items).filter((_, i) => i % 5 === 0).slice(0, 4) : [];
  const go = (e) => { e?.preventDefault(); nav(`/restaurants${q ? `?q=${encodeURIComponent(q)}` : ''}`); };

  return (
    <>
      <div className="hero">
        <div>
          <h1>Good Food.<em>Delivered Fast.</em></h1>
          <p>Discover delicious meals from your favorite restaurants and get them delivered to your doorstep.</p>
          <form className="search" onSubmit={go} role="search">
            <div style={{ flex: '1 1 160px' }}>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for food or restaurants" aria-label="Search for food or restaurants" autoComplete="off" />
              {sugg.length > 0 && <div className="sugg">{sugg.map((s) => <button type="button" key={s.to} onClick={() => nav(s.to)}>{s.emoji} {s.label}</button>)}</div>}
            </div>
            <select aria-label="Delivery location" style={{ border: 0, background: 'none' }} onChange={() => notify('Location updated')}>
              <option>📍 Adyar, Chennai</option><option>📍 T. Nagar</option><option>📍 Anna Nagar</option><option>📍 Velachery</option>
            </select>
            <button className="btn" type="submit">Order now</button>
          </form>
        </div>
        <div className="stage" aria-hidden="true">
          <div className="sun" /><div className="phone">🍔</div>
          <span className="fl" style={{ left: '6%', top: '8%' }}>🍟</span>
          <span className="fl" style={{ right: '8%', top: '14%', animationDelay: '-2s' }}>🥤</span>
          <span className="fl" style={{ left: '2%', bottom: '30%', animationDelay: '-1s' }}>🍔</span>
          <span className="fl" style={{ right: '2%', top: '46%', animationDelay: '-3s' }}>📍</span>
          <div className="road" /><span className="scoot">🛵</span>
        </div>
      </div>

      <Reveal><section><div className="head"><h2>What are you craving?</h2></div>
        <div className="chips">{cats?.map(([e, n]) => <button key={n} className="chip" onClick={() => nav(`/restaurants?cuisine=${n}`)}>{e} {n}</button>)}</div></section></Reveal>

      <section><div className="head"><h2>Popular restaurants</h2><Link className="btn ghost sm" to="/restaurants" style={{ textDecoration: 'none' }}>See all</Link></div>
        {loading ? <CardSkeletons n={4} /> : <div className="grid">{rests.slice(0, 4).map((r, i) => <Reveal key={r.id} delay={i * 0.06}><RestaurantCard r={r} /></Reveal>)}</div>}</section>

      <section><div className="head"><h2>Trending dishes</h2></div>
        {loading ? <CardSkeletons n={4} /> : <div className="grid">{trending.map((f, i) => <Reveal key={f.id} delay={i * 0.06}><FoodCard f={f} /></Reveal>)}</div>}</section>

      <Reveal><section><div className="offers">
        <div className="offer"><b>₹50 off</b>on your first meal<br /><br /><code>WELCOME50</code></div>
        <div className="offer"><b>20% off</b>on orders, up to ₹100<br /><br /><code>FOOD20</code></div>
        <div className="offer"><b>30% off</b>new here? Start hungry<br /><br /><code>FIRSTORDER</code></div></div></section></Reveal>

      <section><div className="head"><h2>Loved by Chennai</h2></div>
        <div className="grid">{REVIEWS.map(([n, t], i) => <Reveal key={n} delay={i * 0.08}><div className="panel"><div aria-label="5 stars">⭐⭐⭐⭐⭐</div><p>{t}</p><b>{n}</b></div></Reveal>)}</div></section>

      <Reveal x={-30}><section><div className="banner"><div className="lg">📱</div><div><h2>Get the FoodRush app</h2><p>Track riders live and reorder favourites in one tap.</p>
        <button className="btn" onClick={() => notify('App coming soon!')}>Download app</button></div></div></section></Reveal>
    </>
  );
}
