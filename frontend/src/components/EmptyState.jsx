import { Link } from 'react-router-dom';
export default function EmptyState({ emoji, title, text, cta = 'Explore restaurants', to = '/restaurants' }) {
  return <div className="empty"><div className="big">{emoji}</div><h2>{title}</h2><p>{text}</p><Link className="btn" to={to} style={{ display: 'inline-block', textDecoration: 'none' }}>{cta}</Link></div>;
}
