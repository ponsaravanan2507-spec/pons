import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../context/Store';

export default function Navbar() {
  const { count, user } = useStore();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { const f = () => setSolid(window.scrollY > 20); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav className={solid ? 'solid' : ''} aria-label="Main">
      <div className="wrap">
        <Link className="logo" to="/">🛵 FoodRush</Link>
        <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
        <div className={`links ${open ? 'open' : ''}`}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/restaurants">Restaurants</NavLink>
          <NavLink to="/cart" className="cartbtn">Cart 🛒<span key={count} className="badge pop">{count}</span></NavLink>
          <NavLink to={user ? '/profile' : '/login'}>{user ? `👤 ${user.name.split(' ')[0]}` : 'Log in'}</NavLink>
        </div>
      </div>
    </nav>
  );
}
