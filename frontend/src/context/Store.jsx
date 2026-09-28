import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, getToken } from '../api';
import { calc } from '../utils';

const Ctx = createContext();
export const useStore = () => useContext(Ctx);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load('fr_cart', {})); // { key: {...food, extras, spice, qty} }
  const [favs, setFavs] = useState(() => load('fr_favs', []));
  const [coupon, setCoupon] = useState(null);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState('');
  const [dark, setDark] = useState(() => load('fr_dark', false));

  useEffect(() => localStorage.setItem('fr_cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('fr_favs', JSON.stringify(favs)), [favs]);
  useEffect(() => {
    localStorage.setItem('fr_dark', JSON.stringify(dark));
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);
  useEffect(() => {
    if (!getToken()) return;
    api('/me').then((u) => { setUser(u); setFavs(u.favorites); }).catch(() => { localStorage.removeItem('fr_token'); sessionStorage.removeItem('fr_token'); });
  }, []);

  const notify = useCallback((m) => { setToast(m); clearTimeout(window.__frToast); window.__frToast = setTimeout(() => setToast(''), 2200); }, []);

  const add = (food, { qty = 1, extras = [], spice = 'Medium' } = {}) => {
    const key = [food.id, [...extras].sort().join('+'), spice].join('|');
    setCart((c) => ({ ...c, [key]: { ...(c[key] || food), key, extras, spice, qty: (c[key]?.qty || 0) + qty } }));
    notify(`✓ ${food.name} added to cart`);
  };
  const changeQty = (key, d) => setCart((c) => {
    const n = { ...c }, q = n[key].qty + d;
    if (q < 1) delete n[key]; else n[key] = { ...n[key], qty: q };
    return n;
  });
  const remove = (key) => { setCart((c) => { const n = { ...c }; delete n[key]; return n; }); notify('Item removed'); };
  const clearCart = () => { setCart({}); setCoupon(null); };

  const toggleFav = (rid) => {
    const on = favs.includes(rid);
    setFavs(on ? favs.filter((x) => x !== rid) : [...favs, rid]);
    notify(on ? 'Removed from favorites' : '❤️ Saved to favorites');
    if (user) api(`/favorites/${rid}`, { method: 'POST' }).catch(() => {});
  };

  const login = (token, u, remember = true) => {
    (remember ? localStorage : sessionStorage).setItem('fr_token', token);
    setUser(u); setFavs([...new Set([...favs, ...u.favorites])]);
  };
  const logout = () => { localStorage.removeItem('fr_token'); sessionStorage.removeItem('fr_token'); setUser(null); notify('Logged out'); };

  const count = Object.values(cart).reduce((a, i) => a + i.qty, 0);
  const totals = useMemo(() => calc(cart, coupon), [cart, coupon]);

  return (
    <Ctx.Provider value={{ cart, count, totals, coupon, setCoupon, add, changeQty, remove, clearCart, favs, toggleFav, user, setUser, login, logout, toast, notify, dark, setDark }}>
      {children}
    </Ctx.Provider>
  );
}
