import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContentCard from '../components/ContentCard';
import { ALL_CONTENT } from '../data/content';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

export default function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = ALL_CONTENT.find(c => c.id === parseInt(id));
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();
  const fav = item ? isFavorite(item.id) : false;

  const [comments, setComments] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`comments_${id}`) || '[]'); }
    catch { return []; }
  });
  const [commentText, setCommentText] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const related = ALL_CONTENT
    .filter(c => c.id !== item?.id && c.genre.some(g => item?.genre.includes(g)))
    .slice(0, 8);

  const handleComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      name: user?.name || 'Foydalanuvchi',
      text: commentText,
      rating: userRating,
      date: new Date().toLocaleDateString('uz-UZ'),
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    localStorage.setItem(`comments_${id}`, JSON.stringify(updated));
    setCommentText('');
    setUserRating(0);
  };

  const deleteComment = (cid) => {
    const updated = comments.filter(c => c.id !== cid);
    setComments(updated);
    localStorage.setItem(`comments_${id}`, JSON.stringify(updated));
  };

  if (!item) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎬</div>
          <h2>Kontent topilmadi</h2>
          <button onClick={() => navigate('/')} style={{
            marginTop: 20, padding: '12px 24px', background: 'var(--accent)',
            border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer',
            fontFamily: 'var(--font)', fontWeight: 700
          }}>Bosh sahifaga</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 'var(--header-h)', minHeight: '100vh' }}>
      <Header />

      <div className="movie-backdrop">
        <img className="movie-backdrop-img" src={item.backdrop} alt={item.title}
          onError={e => { e.target.src = item.poster; }} />
        <div className="movie-backdrop-overlay" />
      </div>

      <div className="movie-detail">
        <div className="movie-detail-inner">
          <img className="movie-poster-big" src={item.poster} alt={item.title}
            onError={e => {
              e.target.src = `https://via.placeholder.com/220x330/16161f/e50914?text=${encodeURIComponent(item.title)}`;
            }} />
          <div className="movie-info">
            <h1 className="movie-title-big">{item.title}</h1>
            <div className="movie-tags">
              <span className="tag accent">{item.type === 'series' ? '📺 Serial' : '🎬 Kino'}</span>
              <span className="tag accent">{item.quality}</span>
              <span className="tag">{item.lang === 'uz' ? "🇺🇿 O'zbek" : '🇷🇺 Rus'}</span>
              {item.genre.map(g => <span key={g} className="tag">{g}</span>)}
            </div>
            <p className="movie-desc-big">{item.desc}</p>
            <div className="movie-stats">
              <div className="stat"><span className="stat-label">Reyting</span><span className="stat-value gold">⭐ {item.rating}</span></div>
              <div className="stat"><span className="stat-label">Yil</span><span className="stat-value">{item.year}</span></div>
              {item.duration && <div className="stat"><span className="stat-label">Davomiyligi</span><span className="stat-value">{item.duration}</span></div>}
              {item.seasons && <div className="stat"><span className="stat-label">Mavsum</span><span className="stat-value">{item.seasons}</span></div>}
              {item.episodes && <div className="stat"><span className="stat-label">Qismlar</span><span className="stat-value">{item.episodes}</span></div>}
              <div className="stat"><span className="stat-label">Izohlar</span><span className="stat-value">{comments.length}</span></div>
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button className="btn-play" onClick={() => navigate(`/watch/${item.id}`)}>▶ Tomosha qilish</button>
              <button
                onClick={() => toggleFavorite(item)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: fav ? 'var(--accent-dim)' : 'rgba(255,255,255,0.1)',
                  color: fav ? 'var(--accent)' : '#fff',
                  padding: '15px 24px', border: fav ? '1.5px solid var(--accent)' : '1.5px solid rgba(255,255,255,0.2)',
                  borderRadius: 10, fontFamily: 'var(--font)', fontSize: '1rem',
                  fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s',
                }}
              >
                {fav ? '❤️ Sevimlilarda' : '🤍 Sevimlilarga'}
              </button>
              <button className="btn-info" onClick={() => navigate(-1)}>← Ortga</button>
            </div>
          </div>
        </div>

        {/* COMMENTS */}
        <div style={{
          marginTop: 48, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
          padding: 32, border: '1px solid var(--border)',
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 24 }}>
            💬 Izohlar ({comments.length})
          </h3>

          {/* Add comment */}
          <div style={{ marginBottom: 32 }}>
            {/* Star rating */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginRight: 8, alignSelf: 'center' }}>
                Bahoning:
              </span>
              {[1,2,3,4,5].map(star => (
                <span
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setUserRating(star)}
                  style={{
                    fontSize: '1.4rem', cursor: 'pointer',
                    color: star <= (hoverRating || userRating) ? 'var(--gold)' : 'var(--text-muted)',
                    transition: 'color 0.15s',
                  }}
                >★</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Fikringizni yozing..."
                rows={3}
                style={{
                  flex: 1, background: 'var(--bg-primary)', border: '1.5px solid var(--border)',
                  borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)',
                  fontFamily: 'var(--font)', fontSize: '0.95rem', resize: 'none', outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim()}
                style={{
                  padding: '12px 20px', background: commentText.trim() ? 'var(--accent)' : 'var(--bg-hover)',
                  border: 'none', borderRadius: 10, color: '#fff', cursor: commentText.trim() ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--font)', fontWeight: 700, alignSelf: 'flex-end',
                  transition: 'background 0.2s',
                }}
              >
                Yuborish
              </button>
            </div>
          </div>

          {/* Comments list */}
          {comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>💬</div>
              <p>Hali izoh yo'q. Birinchi bo'ling!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {comments.map(c => (
                <div key={c.id} style={{
                  background: 'var(--bg-primary)', borderRadius: 10,
                  padding: '16px 20px', border: '1px solid var(--border)',
                  animation: 'fadeUp 0.3s ease',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--accent), #900)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
                      }}>
                        {c.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{c.date}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {c.rating > 0 && (
                        <span style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>
                          {'★'.repeat(c.rating)}{'☆'.repeat(5 - c.rating)}
                        </span>
                      )}
                      {c.name === user?.name && (
                        <button
                          onClick={() => deleteComment(c.id)}
                          style={{
                            background: 'none', border: 'none', color: 'var(--text-muted)',
                            cursor: 'pointer', fontSize: '0.85rem', padding: 4,
                          }}
                          title="O'chirish"
                        >🗑️</button>
                      )}
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="section" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <div className="section-header">
              <div className="section-title">🎭 O'xshash kontentlar</div>
            </div>
            <div className="cards-row">
              {related.map((rel, i) => (
                <ContentCard key={rel.id} item={rel} style={{ animationDelay: `${i * 0.06}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}