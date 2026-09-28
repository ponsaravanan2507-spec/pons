# 🛵 FoodRush – Full-Stack Food Delivery App

React (Vite) + Framer Motion frontend · Node/Express + JWT backend.

## Structure
```
foodrush/
├── backend/
│   ├── server.js        REST API (auth, catalogue, coupons, orders, favorites, addresses)
│   ├── data.js          12 restaurants, 40 dishes (₹) – edit this to change the menu
│   └── .env.example
└── frontend/
    ├── index.html · vite.config.js (proxies /api to :5000)
    └── src/
        ├── App.jsx · main.jsx · api.js · hooks.js · utils.js
        ├── context/Store.jsx      cart, favorites, coupon, auth, toast, dark mode
        ├── components/            Navbar, Footer, RestaurantCard, FoodCard, Summary, Reveal, Toast, Skeleton, EmptyState…
        ├── pages/                 Home, Restaurants, RestaurantDetails, FoodDetails, Cart, Checkout,
        │                          OrderSuccess, Tracking, Auth, Profile
        └── styles/global.css
```

## Install (Node 18+)
```bash
npm run install:all
cp backend/.env.example backend/.env   # optional; set JWT_SECRET
```

## Run (two terminals)
```bash
npm run dev:backend    # http://localhost:5000
npm run dev:frontend   # http://localhost:5173  ← open this
```

## Features
Search with suggestions · filters (cuisine, veg, rating) · 5 sort options · favorites · food customization
· cart with quantities · coupons `WELCOME50`, `FOOD20`, `FIRSTORDER` · checkout · order success ·
live order tracking (server advances a stage every 12 s; change `STEP_MS` in server.js) ·
register/login (bcrypt + JWT) · profile with addresses, orders, favorites, payments, settings · dark mode.
Prices and discounts are always recalculated on the server when an order is placed.

## Add images
Emojis are used by default. To show photos, add an `image` field in `backend/data.js`, e.g.
`{ ...restaurantObject, image: "https://…/burger-house.jpg" }` for a restaurant, or in an item's
mapped object. Cards, banners and food pages pick it up automatically (`components/Visual.jsx`).
Local files: put them in `frontend/public/img/` and use `"/img/burger.jpg"`.

## Customize data
Edit `backend/data.js` (name, cuisine, emoji, rating, mins, fee, dist, tint colour, items `[name, price, emoji, isVeg]`).
Coupons and extras (cheese/sauce/fries) live at the top of `backend/server.js`; mirror extras in `frontend/src/utils.js`.

## Build and deploy
**Single server (simplest, e.g. Render / Railway / a VPS):**
```bash
npm run install:all && npm run build   # builds frontend/dist
JWT_SECRET=your-secret npm start       # Express serves API + built site on $PORT
```
**Split hosting:** deploy `frontend` to Vercel/Netlify (build `npm run build`, output `dist`, set env
`VITE_API_URL=https://your-api.example.com/api`, add an SPA fallback to index.html) and `backend` to
Render/Railway with `CLIENT_ORIGIN=https://your-frontend-url`.

**Production notes:** `db.json` is a demo store and resets on ephemeral hosts – swap it for MongoDB or
PostgreSQL. Payments are simulated; integrate Razorpay/Stripe before taking real money.
