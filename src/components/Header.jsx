import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const handleTheme = () => {
    toggleTheme();
    addNotification(theme === 'dark' ? "☀️ Yorug' rejim" : "🌙 Qorong'u rejim", 'info', 2000);
  };

  const handleLogout = () => {
    logout();
    addNotification('👋 Chiqish amalga oshirildi', 'info', 2000);
    setMenuOpen(false);
  };

  const goTo = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const navLinks = [
    { label: '🏠 Bosh sahifa', path: '/' },
    { label: '🎬 Kinolar', path: '/?tab=movies' },
    { label: '📺 Seriallar', path: '/?tab=series' },
    { label: "🇺🇿 O'zbek", path: '/?lang=uz' },
    { label: '🇷🇺 Rus', path: '/?lang=ru' },
    { label: '❤️ Sevimlilar', path: '/favorites' },
    { label: '🔍 Qidirish', path: '/search' },
  ];

  const btnSt = {
    background:'var(--bg-card)', border:'1px solid var(--border)',
    borderRadius:10, padding:'8px 12px', cursor:'pointer',
    color:'var(--text-primary)', fontFamily:'var(--font)',
    fontSize:'1rem', display:'flex', alignItems:'center', gap:6,
    transition:'all 0.2s', flexShrink:0,
  };

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-logo" onClick={() => navigate('/')}>
          Sevimli<span>Play</span>
        </div>

        {/* Desktop nav */}
        <nav className="header-nav">
          {navLinks.slice(0, 5).map(link => (
            <a key={link.path} className="nav-link" onClick={() => navigate(link.path)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-right">
          {/* Desktop search */}
          <div className="search-input-wrap" onClick={() => navigate('/search')} style={{ cursor:'pointer' }}>
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Qidirish..." readOnly style={{ cursor:'pointer' }} />
          </div>

          {/* Theme */}
          <button onClick={handleTheme} style={btnSt} title="Tema">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Favorites */}
          <button onClick={() => navigate('/favorites')} style={btnSt}>
            ❤️
            {favorites.length > 0 && (
              <span style={{
                background:'var(--accent)', color:'#fff', borderRadius:'50%',
                width:18, height:18, fontSize:'0.7rem', fontWeight:700,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>{favorites.length}</span>
            )}
          </button>

          {/* User menu */}
          <div style={{ position:'relative' }} ref={menuRef}>
            <div className="user-avatar" onClick={() => setMenuOpen(!menuOpen)}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            {menuOpen && (
              <div className="user-menu">
                <div className="user-menu-item" style={{ borderBottom:'1px solid var(--border)', paddingBottom:14 }}>
                  <span>👤</span>
                  <div>
                    <div style={{ fontWeight:700, color:'var(--text-primary)', fontSize:'0.9rem' }}>{user?.name}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{user?.email}</div>
                  </div>
                </div>
                <div className="user-menu-item" onClick={() => { navigate('/profile'); setMenuOpen(false); }}>👤 Profil</div>
                <div className="user-menu-item" onClick={() => { navigate('/favorites'); setMenuOpen(false); }}>❤️ Sevimlilar {favorites.length > 0 && `(${favorites.length})`}</div>
                <div className="user-menu-item" onClick={handleTheme}>{theme === 'dark' ? "☀️ Yorug' rejim" : "🌙 Qorong'u rejim"}</div>
                <div className="user-menu-item danger" onClick={handleLogout}>🚪 Chiqish</div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display:'none' }}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div className="mobile-nav">
          {navLinks.map(link => (
            <div key={link.path} className="mobile-nav-link" onClick={() => goTo(link.path)}>
              {link.label}
            </div>
          ))}
          <div className="mobile-nav-link" onClick={() => { navigate('/profile'); setMobileOpen(false); }}>
            👤 Profil
          </div>
          <div className="mobile-nav-link" onClick={handleTheme}>
            {theme === 'dark' ? "☀️ Yorug' rejim" : "🌙 Qorong'u rejim"}
          </div>
          <div className="mobile-nav-link" style={{ color:'var(--accent)' }} onClick={() => { handleLogout(); navigate('/auth'); }}>
            🚪 Chiqish
          </div>
        </div>
      )}
    </>
  );
}