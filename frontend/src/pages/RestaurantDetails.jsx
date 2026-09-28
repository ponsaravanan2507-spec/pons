import { useParams } from 'react-router-dom';
import { useFetch } from '../hooks';
import { useStore } from '../context/Store';
import { inr } from '../utils';
import FoodCard from '../components/FoodCard';
import Visual from '../components/Visual';
import Reveal from '../components/Reveal';
import EmptyState from '../components/EmptyState';
import { CardSkeletons } from '../components/Skeleton';

export default function RestaurantDetails() {
  const { id } = useParams();
  const { data: r, loading, error } = useFetch(`/restaurants/${id}`);
  const { favs, toggleFav } = useStore();
  if (loading) return <div style={{ paddingTop: 20 }}><div className="skel" style={{ height: 160, marginBottom: 20 }} /><CardSkeletons n={3} /></div>;
  if (error) return <EmptyState emoji="🤔" title="Restaurant not found" text="Let's find you something tasty." />;
  const fav = favs.includes(r.id);
  return (
    <div style={{ paddingTop: 20 }}>
      <div className="banner" style={{ background: `linear-gradient(135deg,${r.tint},#fff)` }}>
        <div className="lg"><Visual item={r} alt={`${r.name} logo`} /></div>
        <div style={{ flex: 1, color: '#2a2422' }}>
          <h1 style={{ fontSize: 'clamp(28px,4vw,42px)' }}>{r.name}</h1>
          <p>{r.cuisine} • ⭐ {r.rating} • {r.mins} min • {inr(r.fee)} delivery</p>
          <p>📍 {r.dist} km away · 12, Cathedral Road, Chennai</p>
        </div>
        <button className="btn ghost" style={{ color: '#2a2422' }} onClick={() => toggleFav(r.id)} aria-pressed={fav}>{fav ? '❤️ Saved' : '🤍 Save'}</button>
      </div>
      <section><div className="head"><h2>Menu</h2></div>
        <div className="grid">{r.items.map((f, i) => <Reveal key={f.id} delay={i * 0.05}><FoodCard f={f} /></Reveal>)}</div></section>
    </div>
  );
}
