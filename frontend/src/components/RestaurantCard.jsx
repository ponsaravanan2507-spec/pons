import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../context/Store';
import { inr } from '../utils';
import Visual from './Visual';
import VegDot from './VegDot';

export default function RestaurantCard({ r }) {
  const { favs, toggleFav } = useStore();
  const nav = useNavigate();
  const fav = favs.includes(r.id);
  return (
    <article className="card" onClick={() => nav(`/restaurant/${r.id}`)}>
      <div className="img" style={{ background: r.tint }}>
        <Visual item={r} alt={r.name} />
        <motion.button whileTap={{ scale: 0.7 }} className={`fav ${fav ? 'on' : ''}`} aria-pressed={fav} aria-label={`${fav ? 'Remove' : 'Add'} ${r.name} ${fav ? 'from' : 'to'} favorites`}
          onClick={(e) => { e.stopPropagation(); toggleFav(r.id); }}>{fav ? '❤️' : '🤍'}</motion.button>
      </div>
      <div className="cb">
        <div className="row"><h3>{r.name}</h3><VegDot veg={r.veg} /></div>
        <div className="meta"><span>{r.cuisine}</span><span>⭐ {r.rating}</span><span>{r.mins} min</span><span>{r.dist} km</span><span>{inr(r.fee)} delivery</span></div>
        <Link className="btn sm" to={`/restaurant/${r.id}`} style={{ textDecoration: 'none', display: 'inline-block' }} onClick={(e) => e.stopPropagation()}>View menu</Link>
      </div>
    </article>
  );
}
