import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const { theme, toggleTheme } = useTheme();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleSearch = (e) => {
    const v = e.target.value;
    setSearchVal(v);
    if (v.length > 0) navigate(`/search?q=${encodeURIComponent(v)}`);
  };

  const handleTheme = () => {
    toggleTheme();
    addNotification(
      theme === 'dark' ? '☀️ Yorug\' rejim yoqildi' : '🌙 Qorong\'u rejim yoqildi',
      'info', 2000
    );
  };

  const handleLogout = () => {
    logout();
    addNotification('👋 Chiqish amalga oshirildi', 'info', 2000);
    setMenuOpen(false);
  };

  const navLinks = [
    { label: 'Bosh sahifa', path: '/' },
    { label: '🎬 Kinolar', path: '/?tab=movies' },
    { label: '📺 Seriallar', path: '/?tab=series' },
    { label: "🇺🇿 O'zbek", path: '/?lang=uz' },
    { label: '🇷🇺 Rus', path: '/?lang=ru' },
  ];

  const btnStyle = {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '8px 12px', cursor: 'pointer',
    color: 'var(--text-primary)', fontFamily: 'var(--font)',
    fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 6,
    transition: 'all 0.2s',
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-logo" onClick={() => navigate('/')}>
        Sevimli<span>Play</span>
      </div>

      <nav className="header-nav">
        {navLinks.map(link => (
          <a key={link.path}
            className={`nav-link ${location.pathname + location.search === link.path ? 'active' : ''}`}
            onClick={() => navigate(link.path)}>
            {link.label}
          </a>
        ))}
      </nav>

      <div className="header-right">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Qidirish..."
            value={searchVal} onChange={handleSearch} />
        </div>

        {/* Theme toggle */}
        <button onClick={handleTheme} style={btnStyle} title="Tema o'zgartirish">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Favorites */}
        <button onClick={() => navigate('/favorites')} style={btnStyle} title="Sevimlilar"
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
          ❤️
          {favorites.length > 0 && (
            <span style={{
              background: 'var(--accent)', color: '#fff', borderRadius: '50%',
              width: 18, height: 18, fontSize: '0.7rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {favorites.length}
            </span>
          )}
        </button>

        {/* User menu */}
        <div style={{ position: 'relative' }} ref={menuRef}>
          <div className="user-avatar" onClick={() => setMenuOpen(!menuOpen)} title={user?.name}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          {menuOpen && (
            <div className="user-menu">
              <div className="user-menu-item" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
                <span>👤</span>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.75rem' }}>{user?.email}</div>
                </div>
              </div>
              <div className="user-menu-item" onClick={() => { navigate('/profile'); setMenuOpen(false); }}>
                👤 Profil
              </div>
              <div className="user-menu-item" onClick={() => { navigate('/favorites'); setMenuOpen(false); }}>
                ❤️ Sevimlilar {favorites.length > 0 && `(${favorites.length})`}
              </div>
              <div className="user-menu-item" onClick={handleTheme}>
                {theme === 'dark' ? '☀️ Yorug\' rejim' : '🌙 Qorong\'u rejim'}
              </div>
              <div className="user-menu-item" onClick={() => { navigate('/'); setMenuOpen(false); }}>
                🏠 Bosh sahifa
              </div>
              <div className="user-menu-item danger" onClick={handleLogout}>
                🚪 Chiqish
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}