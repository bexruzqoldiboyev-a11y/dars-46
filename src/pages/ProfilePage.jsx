import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const users = JSON.parse(localStorage.getItem('sevimliplay_users') || '[]');
    const updated = users.map(u => u.email === user.email ? { ...u, name } : u);
    localStorage.setItem('sevimliplay_users', JSON.stringify(updated));
    localStorage.setItem('sevimliplay_user', JSON.stringify({ ...user, name }));
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const stats = [
    { label: "Sevimlilar", value: favorites.length, icon: "❤️" },
    { label: "Tomosha qilindi", value: Math.floor(Math.random() * 50) + 10, icon: "🎬" },
    { label: "Reytinglar", value: Math.floor(Math.random() * 20) + 5, icon: "⭐" },
  ];

  return (
    <div style={{ paddingTop: 'var(--header-h)', minHeight: '100vh' }}>
      <Header />
      <div style={{ padding: '40px 5%', maxWidth: 800, margin: '0 auto' }}>

        {/* Profile Card */}
        <div style={{
          background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
          padding: 40, marginBottom: 32, border: '1px solid var(--border)',
          display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap',
          animation: 'fadeUp 0.5s ease',
        }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), #900)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem', fontWeight: 800, flexShrink: 0,
            border: '3px solid var(--accent)', boxShadow: '0 0 20px var(--accent-glow)',
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>

          <div style={{ flex: 1 }}>
            {editing ? (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    background: 'var(--bg-primary)', border: '1.5px solid var(--accent)',
                    borderRadius: 8, padding: '8px 14px', color: 'var(--text-primary)',
                    fontFamily: 'var(--font)', fontSize: '1.1rem', fontWeight: 700,
                  }}
                />
                <button onClick={handleSave} style={{
                  padding: '8px 18px', background: 'var(--accent)', border: 'none',
                  borderRadius: 8, color: '#fff', cursor: 'pointer',
                  fontFamily: 'var(--font)', fontWeight: 700,
                }}>Saqlash</button>
                <button onClick={() => setEditing(false)} style={{
                  padding: '8px 14px', background: 'var(--bg-hover)', border: '1px solid var(--border)',
                  borderRadius: 8, color: 'var(--text-muted)', cursor: 'pointer',
                  fontFamily: 'var(--font)',
                }}>Bekor</button>
              </div>
            ) : (
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 6 }}>
                {user?.name}
                {saved && <span style={{ color: 'var(--accent)', fontSize: '0.8rem', marginLeft: 10 }}>✓ Saqlandi</span>}
              </h2>
            )}
            <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setEditing(true)} style={{
                padding: '8px 18px', background: 'var(--bg-hover)',
                border: '1px solid var(--border)', borderRadius: 8,
                color: 'var(--text-primary)', cursor: 'pointer',
                fontFamily: 'var(--font)', fontSize: '0.88rem', fontWeight: 600,
              }}>✏️ Tahrirlash</button>
              <button onClick={() => { logout(); navigate('/auth'); }} style={{
                padding: '8px 18px', background: 'var(--accent-dim)',
                border: '1px solid var(--accent)', borderRadius: 8,
                color: 'var(--accent)', cursor: 'pointer',
                fontFamily: 'var(--font)', fontSize: '0.88rem', fontWeight: 600,
              }}>🚪 Chiqish</button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: 'var(--bg-card)', borderRadius: 'var(--radius)',
              padding: '24px 20px', border: '1px solid var(--border)',
              textAlign: 'center', animation: `fadeUp 0.5s ${i * 0.1}s ease both`,
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>{s.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Favorites preview */}
        {favorites.length > 0 && (
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: 28, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800 }}>❤️ Sevimlilar</h3>
              <span style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}
                onClick={() => navigate('/favorites')}>
                Barchasi →
              </span>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {favorites.slice(0, 6).map(item => (
                <img key={item.id} src={item.poster} alt={item.title}
                  onClick={() => navigate(`/movie/${item.id}`)}
                  style={{
                    width: 80, height: 120, objectFit: 'cover',
                    borderRadius: 8, cursor: 'pointer', transition: 'transform 0.2s',
                  }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}