import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: `${Math.random() * 8}s`,
  duration: `${6 + Math.random() * 8}s`,
  size: `${1 + Math.random() * 2}px`,
}));

export default function AuthPage() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithCredentials, register } = useAuth();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    if (tab === 'login') {
      if (!form.email || !form.password) {
        setError("Barcha maydonlarni to'ldiring!"); setLoading(false); return;
      }
      const res = loginWithCredentials(form.email, form.password);
      if (res.error) { setError(res.error); }
    } else {
      if (!form.name || !form.email || !form.password) {
        setError("Barcha maydonlarni to'ldiring!"); setLoading(false); return;
      }
      if (form.password.length < 6) {
        setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak!"); setLoading(false); return;
      }
      const res = register({ name: form.name, email: form.email, password: form.password });
      if (res.error) { setError(res.error); }
    }
    setLoading(false);
  };

  return (
    <div className="auth-root">
      <div className="auth-bg-particles">
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className="auth-particle"
            style={{
              left: p.left,
              top: '-10px',
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <div className="auth-container">
        <div className="auth-brand">
          <div className="auth-brand-logo">
            Sevimli<span>Play</span>
          </div>
          <div className="auth-tagline">🎬 Eng yaxshi kinolar & seriallar</div>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => { setTab('login'); setError(''); }}
            >
              Kirish
            </button>
            <button
              className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => { setTab('register'); setError(''); }}
            >
              Ro'yxatdan o'tish
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {tab === 'register' && (
              <div className="auth-field" style={{ animation: 'slideLeft 0.3s ease' }}>
                <label className="auth-label">Ismingiz</label>
                <input
                  className="auth-input"
                  type="text"
                  name="name"
                  placeholder="Ismingizni kiriting"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label">Email</label>
              <input
                className="auth-input"
                type="email"
                name="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Parol</label>
              <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {error && <div className="auth-error">⚠️ {error}</div>}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading
                ? '⏳ Yuklanmoqda...'
                : tab === 'login'
                  ? '▶ Kirish'
                  : '✨ Ro\'yxatdan o\'tish'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}