import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFetch } from '../hooks';
import { inr } from '../utils';
import EmptyState from '../components/EmptyState';

export default function OrderSuccess() {
  const { id } = useParams();
  const { data: o, loading, error } = useFetch(`/orders/${id}`);
  if (loading) return <div className="skel" style={{ height: 380, marginTop: 40 }} />;
  if (error) return <EmptyState emoji="📦" title="Order not found" text="We couldn't find that order." />;
  return (
    <div className="panel" style={{ maxWidth: 520, margin: '40px auto', textAlign: 'center' }}>
      <motion.div className="tick" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}>✓</motion.div>
      <h2 style={{ margin: '16px 0 6px' }}>Order confirmed</h2>
      <p>Your delicious food is on the way!</p>
      <div style={{ textAlign: 'left', margin: '16px 0' }}>
        <div className="tot"><span>Order ID</span><b>{o.id}</b></div>
        <div className="tot"><span>Restaurant</span><b>{o.restaurant}</b></div>
        <div className="tot"><span>Estimated delivery</span><b>{o.eta} min</b></div>
        <div className="tot g"><span>Total</span><span>{inr(o.total)}</span></div>
      </div>
      <Link className="btn" to={`/track/${o.id}`} style={{ textDecoration: 'none', display: 'inline-block' }}>Track order</Link>
    </div>
  );
}
