import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ContentCard from '../components/ContentCard';
import { ALL_CONTENT } from '../data/content';

export default function WatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ID ni to'g'ri topish
  const itemId = parseInt(id);
  const item = ALL_CONTENT.find(c => c.id === itemId);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (item) {
      const count = parseInt(localStorage.getItem('watch_count') || '0');
      localStorage.setItem('watch_count', String(count + 1));
    }
  }, [itemId]);

  const related = item
    ? ALL_CONTENT.filter(c => c.id !== item.id && c.genre.some(g => item.genre.includes(g))).slice(0, 6)
    : [];

  if (!item) {
    return (
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
        <div style={{ fontSize:'4rem' }}>📽️</div>
        <h2>Kontent topilmadi</h2>
        <button onClick={() => navigate('/')} style={{
          padding:'12px 28px', background:'var(--accent)', border:'none',
          borderRadius:10, color:'#fff', cursor:'pointer',
          fontFamily:'var(--font)', fontWeight:700, fontSize:'1rem',
        }}>🏠 Bosh sahifaga</button>
      </div>
    );
  }

  // Embed URL ni to'g'ri tuzish
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('archive.org')) return url;
    if (url.includes('youtube.com/embed')) return url;
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(item.embed);

  return (
    <div style={{ minHeight:'100vh', overflowX:'hidden', background:'var(--bg-primary)' }}>
      <Header />

      <div style={{ paddingTop:'var(--header-h)' }}>
        {/* Back button */}
        <div style={{ padding:'16px 16px 0' }}>
          <button
            onClick={() => navigate(`/movie/${item.id}`)}
            style={{
              background:'var(--bg-card)', border:'1px solid var(--border)',
              color:'var(--text-primary)', padding:'10px 18px', borderRadius:8,
              cursor:'pointer', fontFamily:'var(--font)', fontSize:'0.88rem',
              display:'inline-flex', alignItems:'center', gap:8,
            }}
          >
            ← {item.title}
          </button>
        </div>

        {/* Video Player - 16:9 responsive */}
        <div style={{
          width:'100%',
          maxWidth:1100,
          margin:'16px auto 0',
          padding:'0 16px',
        }}>
          <div style={{
            position:'relative',
            width:'100%',
            paddingTop:'56.25%',
            background:'#000',
            borderRadius:12,
            overflow:'hidden',
            boxShadow:'0 16px 48px rgba(0,0,0,0.7)',
          }}>
            <iframe
              key={embedUrl}
              style={{
                position:'absolute',
                top:0, left:0,
                width:'100%',
                height:'100%',
                border:'none',
              }}
              src={embedUrl}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>

          {/* Info */}
          <div style={{ padding:'16px 0 8px' }}>
            <h2 style={{ fontSize:'1.2rem', fontWeight:800, marginBottom:8 }}>{item.title}</h2>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap', color:'var(--text-muted)', fontSize:'0.82rem', marginBottom:10 }}>
              <span>📅 {item.year}</span>
              <span>⭐ {item.rating}</span>
              <span>{item.quality}</span>
              <span>{item.lang === 'uz' ? "🇺🇿 O'zbek" : '🇷🇺 Rus'}</span>
              {item.duration && <span>⏱ {item.duration}</span>}
              {item.type === 'series' && item.seasons && (
                <span>📺 {item.seasons} mavsum{item.episodes ? ` · ${item.episodes} qism` : ''}</span>
              )}
            </div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
              {item.genre.map(g => (
                <span key={g} style={{
                  background:'var(--accent-dim)', color:'var(--accent)',
                  padding:'3px 10px', borderRadius:20, fontSize:'0.75rem', fontWeight:600,
                  border:'1px solid var(--accent)',
                }}>{g}</span>
              ))}
            </div>
            <p style={{ color:'var(--text-secondary)', lineHeight:1.7, fontSize:'0.88rem' }}>{item.desc}</p>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div style={{ paddingBottom:60 }}>
              <div className="section-header" style={{ margin:'24px 0 16px' }}>
                <div className="section-title">▶ Keyingi tomosha qilish</div>
              </div>
              <div className="cards-row">
                {related.map((rel, i) => (
                  <ContentCard key={rel.id} item={rel} style={{ animationDelay:`${i * 0.06}s` }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}