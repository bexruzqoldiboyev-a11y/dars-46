import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ContentCard from '../components/ContentCard';
import { ALL_CONTENT } from '../data/content';

export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = ALL_CONTENT.find(c => c.id === parseInt(id));

  const related = ALL_CONTENT
    .filter(c => c.id !== item?.id && c.genre.some(g => item?.genre.includes(g)))
    .slice(0, 6);

  if (!item) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>📽️</div>
          <h2>Kontent topilmadi</h2>
          <button
            onClick={() => navigate('/')}
            style={{
              marginTop: 20, padding: '12px 24px', background: 'var(--accent)',
              border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer',
              fontFamily: 'var(--font)', fontWeight: 700
            }}
          >
            Bosh sahifaga
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="watch-page">
      <Header />

      <div className="player-wrap">
        {/* Back btn */}
        <button
          onClick={() => navigate(`/movie/${item.id}`)}
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            color: 'var(--text-primary)', padding: '10px 20px',
            borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font)',
            fontSize: '0.9rem', marginBottom: 20, display: 'flex',
            alignItems: 'center', gap: 8, transition: 'all 0.3s',
          }}
          onMouseEnter={e => e.target.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.target.style.background = 'var(--bg-card)'}
        >
          ← {item.title}ga qaytish
        </button>

        {/* Player */}
        <div className="player-container">
          <iframe
            src={item.embed}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Info */}
        <div className="player-info">
          <div className="player-title">{item.title}</div>
          <div className="player-meta">
            <span>📅 {item.year}</span>
            <span>⭐ {item.rating}</span>
            <span>{item.quality}</span>
            <span>{item.lang === 'uz' ? "🇺🇿 O'zbek tili" : '🇷🇺 Rus tili'}</span>
            {item.duration && <span>⏱ {item.duration}</span>}
            {item.type === 'series' && <span>📺 {item.seasons} mavsum · {item.episodes} qism</span>}
            {item.genre.map(g => <span key={g} style={{ color: 'var(--accent)' }}>{g}</span>)}
          </div>
          <p style={{ marginTop: 16, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{item.desc}</p>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 40, paddingBottom: 60 }}>
            <div className="section-header" style={{ marginBottom: 20 }}>
              <div className="section-title">▶ Keyingi tomosha qilish</div>
            </div>
            <div className="cards-row">
              {related.map((rel, i) => (
                <ContentCard key={rel.id} item={rel} style={{ animationDelay: `${i * 0.06}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}