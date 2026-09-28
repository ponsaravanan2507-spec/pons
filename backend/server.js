// FoodRush API – Express + JWT auth + JSON-file storage (swap db for MongoDB/Postgres in production)
const express = require('express'), cors = require('cors'), bcrypt = require('bcryptjs'), jwt = require('jsonwebtoken');
const fs = require('fs'), path = require('path');
const { CATS, R } = require('./data');

const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const DB_FILE = path.join(__dirname, 'db.json');
const STEP_MS = 12000; // demo: order advances one tracking stage every 12s
const STATUSES = ['Order confirmed', 'Restaurant preparing', 'Food picked up', 'Out for delivery', 'Delivered'];
const EXTRAS = { cheese: 30, sauce: 15, sides: 60 };
const COUPONS = {
  WELCOME50: { type: 'flat', value: 50, note: '₹50 off' },
  FOOD20: { type: 'pct', value: 20, cap: 100, note: '20% off (max ₹100)' },
  FIRSTORDER: { type: 'pct', value: 30, cap: 100, note: '30% off (max ₹100)' },
};

// ---- tiny persistence layer ----
let db = { users: [], orders: [] };
try { db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch { /* first run */ }
const save = () => fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

// ---- helpers ----
const foodOut = (m) => {
  const r = R[m.rid];
  return { ...m, rname: r.name, fee: r.fee, tint: r.tint,
    description: `${m.name} freshly prepared by ${r.name}, packed hot for delivery.`,
    ingredients: [m.veg ? 'Fresh vegetables' : 'Farm-fresh chicken', 'Whole spices', `${r.cuisine} house sauce`, 'Cold-pressed oil'] };
};
const restOut = (r) => ({ ...r, items: r.items.map(foodOut) });
const userOut = (u) => ({ id: u.id, name: u.name, email: u.email, phone: u.phone, favorites: u.favorites, addresses: u.addresses });
const discount = (sub, code) => {
  const c = COUPONS[code]; if (!c) return 0;
  return Math.min(sub, c.type === 'flat' ? c.value : Math.min(c.cap, (sub * c.value) / 100));
};
const token = (u) => jwt.sign({ id: u.id }, SECRET, { expiresIn: '7d' });
const readAuth = (req) => {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  try { return db.users.find((u) => u.id === jwt.verify(t, SECRET).id); } catch { return null; }
};
const optAuth = (req, _res, next) => { req.user = readAuth(req); next(); };
const auth = (req, res, next) => { req.user = readAuth(req); req.user ? next() : res.status(401).json({ error: 'Please log in' }); };

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json());

// ---- catalogue ----
app.get('/api/health', (_q, res) => res.json({ ok: true }));
app.get('/api/categories', (_q, res) => res.json(CATS));
app.get('/api/restaurants', (req, res) => {
  const { q = '', cuisine = '', veg = '', minRating = 0, sort = 'pop' } = req.query;
  const s = q.toLowerCase();
  const avg = (r) => r.items.reduce((a, m) => a + m.price, 0) / r.items.length;
  const sorters = {
    pop: (a, b) => b.rating - a.rating || a.dist - b.dist, rate: (a, b) => b.rating - a.rating,
    lo: (a, b) => avg(a) - avg(b), hi: (a, b) => avg(b) - avg(a), fast: (a, b) => a.mins - b.mins,
  };
  const out = R.filter((r) => (!cuisine || r.cuisine === cuisine) && (!veg || r.veg) && r.rating >= +minRating &&
    (!s || (r.name + r.cuisine + r.items.map((m) => m.name).join(' ')).toLowerCase().includes(s)))
    .sort(sorters[sort] || sorters.pop).map(restOut);
  res.json(out);
});
app.get('/api/restaurants/:id', (req, res) => R[req.params.id] ? res.json(restOut(R[req.params.id])) : res.status(404).json({ error: 'Not found' }));
app.get('/api/foods/:id', (req, res) => {
  const [r, j] = req.params.id.split('-');
  const m = R[r]?.items[j]; m ? res.json(foodOut(m)) : res.status(404).json({ error: 'Not found' });
});
app.get('/api/suggest', (req, res) => {
  const s = (req.query.q || '').toLowerCase(); if (!s) return res.json([]);
  const hits = [];
  R.forEach((r) => {
    if ((r.name + r.cuisine).toLowerCase().includes(s)) hits.push({ label: r.name, to: `/restaurant/${r.id}`, emoji: r.emoji });
    r.items.forEach((m) => m.name.toLowerCase().includes(s) && hits.push({ label: `${m.name} · ${r.name}`, to: `/food/${m.id}`, emoji: m.emoji }));
  });
  res.json(hits.slice(0, 6));
});
app.get('/api/coupons/:code', (req, res) => {
  const code = req.params.code.toUpperCase(), c = COUPONS[code];
  c ? res.json({ code, ...c }) : res.status(404).json({ error: 'Invalid coupon code' });
});

// ---- auth ----
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password || password.length < 6) return res.status(400).json({ error: 'Name, email and a 6+ character password are required' });
  if (db.users.some((u) => u.email === email.toLowerCase())) return res.status(409).json({ error: 'Email already registered' });
  const u = { id: Date.now().toString(36), name, email: email.toLowerCase(), phone: phone || '', hash: bcrypt.hashSync(password, 10), favorites: [], addresses: [] };
  db.users.push(u); save(); res.json({ token: token(u), user: userOut(u) });
});
app.post('/api/auth/login', (req, res) => {
  const u = db.users.find((x) => x.email === (req.body.email || '').toLowerCase());
  if (!u || !bcrypt.compareSync(req.body.password || '', u.hash)) return res.status(401).json({ error: 'Wrong email or password' });
  res.json({ token: token(u), user: userOut(u) });
});
app.get('/api/me', auth, (req, res) => res.json(userOut(req.user)));
app.put('/api/me', auth, (req, res) => {
  const { name, phone } = req.body; if (name) req.user.name = name; if (phone !== undefined) req.user.phone = phone;
  save(); res.json(userOut(req.user));
});
app.post('/api/favorites/:rid', auth, (req, res) => {
  const id = +req.params.rid, f = req.user.favorites;
  f.includes(id) ? f.splice(f.indexOf(id), 1) : f.push(id); save(); res.json(f);
});
app.post('/api/addresses', auth, (req, res) => {
  if (!req.body.text) return res.status(400).json({ error: 'Address is required' });
  req.user.addresses.push({ id: Date.now().toString(36), label: req.body.label || 'Home', text: req.body.text });
  save(); res.json(req.user.addresses);
});
app.delete('/api/addresses/:id', auth, (req, res) => {
  req.user.addresses = req.user.addresses.filter((a) => a.id !== req.params.id); save(); res.json(req.user.addresses);
});

// ---- orders (prices are always recomputed on the server) ----
const withStatus = (o) => ({ ...o, status: Math.min(4, Math.floor((Date.now() - o.createdAt) / STEP_MS)), statuses: STATUSES });
app.post('/api/orders', optAuth, (req, res) => {
  const { items = [], coupon, address, phone, payment = 'UPI' } = req.body;
  if (!items.length || !address) return res.status(400).json({ error: 'Cart and delivery address are required' });
  const lines = [];
  for (const it of items) {
    const [r, j] = String(it.id).split('-'); const m = R[r]?.items[j];
    if (!m) return res.status(400).json({ error: `Unknown item ${it.id}` });
    const extras = (it.extras || []).filter((k) => EXTRAS[k]);
    const unit = m.price + extras.reduce((a, k) => a + EXTRAS[k], 0);
    lines.push({ id: m.id, name: m.name, emoji: m.emoji, rid: m.rid, qty: Math.max(1, +it.qty || 1), extras, spice: it.spice || 'Medium', unit });
  }
  const sub = lines.reduce((a, l) => a + l.unit * l.qty, 0);
  const fee = [...new Set(lines.map((l) => l.rid))].reduce((a, r) => a + R[r].fee, 0);
  const disc = discount(sub, (coupon || '').toUpperCase()), tax = (sub - disc) * 0.05;
  const order = {
    id: 'FR' + Math.floor(100000 + Math.random() * 900000), userId: req.user?.id || null, createdAt: Date.now(),
    lines, restaurant: [...new Set(lines.map((l) => R[l.rid].name))].join(', '), address, phone, payment,
    sub, fee, disc, tax, total: sub - disc + fee + tax, eta: 32, partner: { name: 'Ravi Kumar', rating: 4.9 },
  };
  db.orders.push(order); save(); res.json(withStatus(order));
});
app.get('/api/orders', auth, (req, res) => res.json(db.orders.filter((o) => o.userId === req.user.id).reverse().map(withStatus)));
app.get('/api/orders/:id', (req, res) => {
  const o = db.orders.find((x) => x.id === req.params.id); o ? res.json(withStatus(o)) : res.status(404).json({ error: 'Order not found' });
});

// ---- optional: serve the built frontend from the same server ----
const dist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(dist)) { app.use(express.static(dist)); app.get('*', (_q, res) => res.sendFile(path.join(dist, 'index.html'))); }

app.listen(PORT, () => console.log(`FoodRush API running on http://localhost:${PORT}`));
