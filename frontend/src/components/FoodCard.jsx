import { Link } from 'react-router-dom';
import { useStore } from '../context/Store';
import { inr } from '../utils';
import Visual from './Visual';
import VegDot from './VegDot';

export default function FoodCard({ f }) {
  const { add } = useStore();
  return (
    <article className="card">
      <Link to={`/food/${f.id}`} className="img" style={{ background: f.tint, textDecoration: 'none' }} aria-label={`View ${f.name}`}><Visual item={f} /></Link>
      <div className="cb">
        <div className="row"><h3>{f.name}</h3><VegDot veg={f.veg} /></div>
        <div className="meta"><span>{f.rname}</span></div>
        <div className="row"><b>{inr(f.price)}</b><button className="btn sm" onClick={() => add(f)}>Add to cart</button></div>
      </div>
    </article>
  );
}
