import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useFetch } from '../hooks';
import RestaurantCard from '../components/RestaurantCard';
import EmptyState from '../components/EmptyState';
import { CardSkeletons } from '../components/Skeleton';
import Reveal from '../components/Reveal';

export default function Restaurants() {
  const [params, setParams] = useSearchParams();
  const f = { q: params.get('q') || '', cuisine: params.get('cuisine') || '', veg: params.get('veg') || '', minRating: params.get('minRating') || '0', sort: params.get('sort') || 'pop' };
  const set = (k, v) => { const p = new URLSearchParams(params); v && v !== '0' ? p.set(k, v) : p.delete(k); setParams(p, { replace: true }); };
  const { data: cats } = useFetch('/categories');
  const [list, setList] = useState(null);

  // Debounced server-side search / filter / sort.
  useEffect(() => {
    setList(null);
    const t = setTimeout(() => api(`/restaurants?${new URLSearchParams(f)}`).then(setList).catch(() => setList([])), 250);
    return () => clearTimeout(t);
  }, [params]); // eslint-disable-line

  return (
    <div style={{ paddingTop: 20 }}>
      <div className="head"><h2>Restaurants</h2></div>
      <div className="tools">
        <input value={f.q} onChange={(e) => set('q', e.target.value)} placeholder="Search restaurant, dish or cuisine" aria-label="Search" />
        <select aria-label="Cuisine" value={f.cuisine} onChange={(e) => set('cuisine', e.target.value)}><option value="">All cuisines</option>{cats?.map(([, n]) => <option key={n}>{n}</option>)}</select>
        <select aria-label="Diet" value={f.veg} onChange={(e) => set('veg', e.target.value)}><option value="">Veg & non-veg</option><option value="1">Pure veg</option></select>
        <select aria-label="Rating" value={f.minRating} onChange={(e) => set('minRating', e.target.value)}><option value="0">Any rating</option><option value="4">4.0+</option><option value="4.5">4.5+</option></select>
        <select aria-label="Sort" value={f.sort} onChange={(e) => set('sort', e.target.value)}><option value="pop">Popular</option><option value="rate">Rating</option><option value="lo">Price low → high</option><option value="hi">Price high → low</option><option value="fast">Fast delivery</option></select>
      </div>
      {list === null ? <CardSkeletons /> : list.length === 0
        ? <EmptyState emoji="🔍" title="No delicious discoveries yet 🍔" text="Nothing matches those filters. Try a different search." cta="Clear filters" to="/restaurants" />
        : <div className="grid">{list.map((r, i) => <Reveal key={r.id} delay={(i % 6) * 0.05}><RestaurantCard r={r} /></Reveal>)}</div>}
    </div>
  );
}
