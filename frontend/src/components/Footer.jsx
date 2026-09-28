import { Link } from 'react-router-dom';

const COLS = [
  ['Company', ['About', 'Careers', 'Contact']],
  ['For restaurants', ['Partner with us', 'Restaurant login']],
  ['Support', ['Help Center', 'FAQs', 'Terms', 'Privacy']],
];
export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="cols">
          <div><h3>🛵 FoodRush</h3><p>Good food from your favourite kitchens, at your door in minutes.</p></div>
          {COLS.map(([t, links]) => <div key={t}><h3>{t}</h3>{links.map((l) => <Link key={l} to="/">{l}</Link>)}</div>)}
        </div>
        <div className="copy">© {new Date().getFullYear()} FoodRush. Demo project – restaurants are fictional. &nbsp;
          <a href="#" style={{ display: 'inline' }} aria-label="Instagram">Instagram</a> · <a href="#" style={{ display: 'inline' }} aria-label="X">X</a> · <a href="#" style={{ display: 'inline' }} aria-label="YouTube">YouTube</a></div>
      </div>
    </footer>
  );
}
