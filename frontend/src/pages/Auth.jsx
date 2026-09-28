import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useStore } from '../context/Store';

export default function Auth() {
  const { login, notify } = useStore();
  const nav = useNavigate();
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '' });
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      const { token, user } = await api(`/auth/${mode}`, { method: 'POST', body: f });
      login(token, user, remember); notify(`Welcome, ${user.name.split(' ')[0]}!`); nav('/profile');
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  };

  return (
    <form className="panel auth" onSubmit={submit}>
      <h2 style={{ marginBottom: 6 }}>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
      <p className="meta">Order from your favourite restaurants in a few taps.</p>
      <button type="button" className="btn ghost google" onClick={() => notify('Google sign-in is a UI demo')}>🌐 Continue with Google</button>
      {mode === 'register' && <label className="field">Full name<input required value={f.name} onChange={on('name')} autoComplete="name" /></label>}
      <label className="field">Email<input type="email" required value={f.email} onChange={on('email')} autoComplete="email" /></label>
      {mode === 'register' && <label className="field">Phone number<input type="tel" value={f.phone} onChange={on('phone')} autoComplete="tel" /></label>}
      <label className="field">Password<input type="password" required minLength={6} value={f.password} onChange={on('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
      <div className="row" style={{ marginBottom: 12 }}>
        <label><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me</label>
        <button type="button" className="chip" onClick={() => notify('Password reset email sent (demo)')}>Forgot password?</button>
      </div>
      {err && <p className="err" role="alert">{err}</p>}
      <button className="btn" style={{ width: '100%' }} disabled={busy}>{busy ? <span className="spin" /> : mode === 'login' ? 'Log in' : 'Create account'}</button>
      <p style={{ textAlign: 'center' }}>{mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
        <button type="button" className="chip" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}>{mode === 'login' ? 'Create account' : 'Log in'}</button></p>
    </form>
  );
}
