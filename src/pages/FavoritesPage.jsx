import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContentCard from '../components/ContentCard';
import { useFavorites } from '../context/FavoritesContext';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  return (
    <div style={{ paddingTop: 'var(--header-h)', minHeight: '100vh' }}>
      <Header />
      <div style={{ padding: '40px 5%' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 8 }}>
          ❤️ Sevimlilar
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
          {favorites.length} ta kontent saqlangan
        </p>

        {favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>💔</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: 8, color: 'var(--text-primary)' }}>
              Hali hech narsa qo'shilmagan
            </h3>
            <p style={{ marginBottom: 24 }}>Kinolar va seriallarni sevimlilar ro'yxatiga qo'shing</p>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '12px 28px', background: 'var(--accent)', border: 'none',
                borderRadius: 10, color: '#fff', fontFamily: 'var(--font)',
                fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem',
              }}
            >
              🎬 Kontentlarni ko'rish
            </button>
          </div>
        ) : (
          <div className="cards-row">
            {favorites.map((item, i) => (
              <ContentCard key={item.id} item={item} style={{ animationDelay: `${i * 0.05}s` }} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}