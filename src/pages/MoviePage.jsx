import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContentCard from '../components/ContentCard';
import { ALL_CONTENT } from '../data/content';

export default function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = ALL_CONTENT.find(c => c.id === parseInt(id));

  const related = ALL_CONTENT
    .filter(c => c.id !== item?.id && c.genre.some(g => item?.genre.includes(g)))
    .slice(0, 8);

  if (!item) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎬</div>
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
    <div style={{ paddingTop: 'var(--header-h)', minHeight: '100vh' }}>
      <Header />

      {/* Backdrop */}
      <div className="movie-backdrop">
        <img
          className="movie-backdrop-img"
          src={item.backdrop}
          alt={item.title}
          onError={e => { e.target.src = item.poster; }}
        />
        <div className="movie-backdrop-overlay" />
      </div>

      {/* Detail */}
      <div className="movie-detail">
        <div className="movie-detail-inner">
          <img
            className="movie-poster-big"
            src={item.poster}
            alt={item.title}
            onError={e => {
              e.target.src = `https://via.placeholder.com/220x330/16161f/e50914?text=${encodeURIComponent(item.title)}`;
            }}
          />
          <div className="movie-info">
            <h1 className="movie-title-big">{item.title}</h1>

            <div className="movie-tags">
              <span className="tag accent">
                {item.type === 'series' ? '📺 Serial' : '🎬 Kino'}
              </span>
              <span className="tag accent">{item.quality}</span>
              <span className="tag">
                {item.lang === 'uz' ? "🇺🇿 O'zbek" : '🇷🇺 Rus'}
              </span>
              {item.genre.map(g => (
                <span key={g} className="tag">{g}</span>
              ))}
            </div>

            <p className="movie-desc-big">{item.desc}</p>

            <div className="movie-stats">
              <div className="stat">
                <span className="stat-label">Reyting</span>
                <span className="stat-value gold">⭐ {item.rating}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Yil</span>
                <span className="stat-value">{item.year}</span>
              </div>
              {item.duration && (
                <div className="stat">
                  <span className="stat-label">Davomiyligi</span>
                  <span className="stat-value">{item.duration}</span>
                </div>
              )}
              {item.seasons && (
                <div className="stat">
                  <span className="stat-label">Mavsum</span>
                  <span className="stat-value">{item.seasons}</span>
                </div>
              )}
              {item.episodes && (
                <div className="stat">
                  <span className="stat-label">Qismlar</span>
                  <span className="stat-value">{item.episodes}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button
                className="btn-play"
                onClick={() => navigate(`/watch/${item.id}`)}
              >
                ▶ Tomosha qilish
              </button>
              <button
                className="btn-info"
                onClick={() => navigate(-1)}
              >
                ← Ortga
              </button>
            </div>
          </div>
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