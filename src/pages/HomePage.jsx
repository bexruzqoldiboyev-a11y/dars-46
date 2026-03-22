import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContentCard from '../components/ContentCard';
import { MOVIES, SERIES, ALL_CONTENT, GENRES } from '../data/content';

const HERO_ITEMS = [
  ALL_CONTENT.find(c => c.id === 1),
  ALL_CONTENT.find(c => c.id === 11),
  ALL_CONTENT.find(c => c.id === 103),
  ALL_CONTENT.find(c => c.id === 24),
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('all');
  const [activeLang, setActiveLang] = useState('all');
  const [activeGenre, setActiveGenre] = useState('Hammasi');
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);

  const tabParam = searchParams.get('tab');
  const langParam = searchParams.get('lang');

  useEffect(() => {
    if (tabParam === 'movies') setActiveTab('movies');
    else if (tabParam === 'series') setActiveTab('series');
    else setActiveTab('all');
    if (langParam === 'uz') setActiveLang('uz');
    else if (langParam === 'ru') setActiveLang('ru');
    else setActiveLang('all');
  }, [tabParam, langParam]);

  // Hero auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroVisible(false);
      setTimeout(() => {
        setHeroIdx(prev => (prev + 1) % HERO_ITEMS.length);
        setHeroVisible(true);
      }, 400);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const hero = HERO_ITEMS[heroIdx];

  const getFiltered = (items) => {
    let filtered = items;
    if (activeLang !== 'all') filtered = filtered.filter(c => c.lang === activeLang);
    if (activeGenre !== 'Hammasi') filtered = filtered.filter(c => c.genre.includes(activeGenre));
    return filtered;
  };

  const displayContent = activeTab === 'all'
    ? getFiltered(ALL_CONTENT)
    : activeTab === 'movies'
      ? getFiltered(MOVIES)
      : getFiltered(SERIES);

  // Sections
  const topRated = [...ALL_CONTENT].sort((a, b) => b.rating - a.rating).slice(0, 10);
  const newReleases = [...ALL_CONTENT].sort((a, b) => b.year - a.year).slice(0, 10);
  const uzContent = ALL_CONTENT.filter(c => c.lang === 'uz').slice(0, 10);
  const ruContent = ALL_CONTENT.filter(c => c.lang === 'ru').slice(0, 10);
  const seriesList = SERIES.slice(0, 10);
  const moviesList = MOVIES.slice(0, 10);

  return (
    <div className="home-page">
      <Header />

      {/* HERO */}
      {hero && (
        <div className="hero">
          <div
            className="hero-bg"
            style={{
              backgroundImage: `url(${hero.backdrop})`,
              opacity: heroVisible ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          />
          <div className="hero-overlay" />
          <div className="hero-overlay-side" />
          <div className="hero-content" style={{ opacity: heroVisible ? 1 : 0, transition: 'opacity 0.4s ease' }}>
            <div className="hero-badge">
              {hero.type === 'series' ? '📺 SERIAL' : '🎬 KINO'} · {hero.quality}
            </div>
            <h1 className="hero-title">{hero.title}</h1>
            <div className="hero-meta">
              <span className="hero-meta-item">
                <span className="star">⭐</span>
                <span className="hero-rating">{hero.rating}</span>
              </span>
              <span className="hero-meta-item">📅 {hero.year}</span>
              {hero.duration && <span className="hero-meta-item">⏱ {hero.duration}</span>}
              {hero.seasons && <span className="hero-meta-item">📺 {hero.seasons} mavsum</span>}
              <span className="hero-meta-item">
                🌐 {hero.lang === 'uz' ? "O'zbek tili" : 'Rus tili'}
              </span>
            </div>
            <p className="hero-desc">{hero.desc}</p>
            <div className="hero-actions">
              <button
                className="btn-play"
                onClick={() => navigate(`/watch/${hero.id}`)}
              >
                ▶ Tomosha qilish
              </button>
              <button
                className="btn-info"
                onClick={() => navigate(`/movie/${hero.id}`)}
              >
                ℹ Batafsil
              </button>
            </div>
          </div>

          {/* Hero dots */}
          <div style={{
            position: 'absolute', bottom: 32, right: '5%', zIndex: 2,
            display: 'flex', gap: 8,
          }}>
            {HERO_ITEMS.map((_, i) => (
              <div
                key={i}
                onClick={() => { setHeroIdx(i); setHeroVisible(true); }}
                style={{
                  width: i === heroIdx ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === heroIdx ? 'var(--accent)' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* TOP RATED */}
      <div className="section">
        <div className="section-header">
          <div className="section-title">🏆 Eng yuqori baholangan</div>
          <span className="section-link" onClick={() => setActiveTab('all')}>Hammasi →</span>
        </div>
        <div className="cards-row">
          {topRated.map((item, i) => (
            <ContentCard key={item.id} item={item} style={{ animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      </div>

      {/* TABS */}
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="page-tabs">
          {[
            { key: 'all', label: '🎭 Hammasi' },
            { key: 'movies', label: '🎬 Kinolar' },
            { key: 'series', label: '📺 Seriallar' },
          ].map(t => (
            <button
              key={t.key}
              className={`page-tab ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
          {[
            { key: 'all', label: '🌐 Barchasi' },
            { key: 'uz', label: "🇺🇿 O'zbek" },
            { key: 'ru', label: '🇷🇺 Rus' },
          ].map(t => (
            <button
              key={t.key + '-lang'}
              className={`page-tab ${activeLang === t.key ? 'active' : ''}`}
              onClick={() => setActiveLang(t.key)}
              style={{ marginLeft: t.key === 'all' ? 'auto' : 0 }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Genre Filter */}
        <div className="genre-filter">
          {GENRES.map(g => (
            <button
              key={g}
              className={`genre-btn ${activeGenre === g ? 'active' : ''}`}
              onClick={() => setActiveGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: '0.9rem' }}>
          {displayContent.length} ta kontent topildi
        </div>

        <div className="cards-row">
          {displayContent.map((item, i) => (
            <ContentCard key={item.id} item={item} style={{ animationDelay: `${i * 0.04}s` }} />
          ))}
        </div>
      </div>

      {/* NEW RELEASES */}
      <div className="section" style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
        <div className="section-header">
          <div className="section-title">🆕 Yangi chiqganlar</div>
        </div>
        <div className="cards-row">
          {newReleases.map((item, i) => (
            <ContentCard key={item.id} item={item} style={{ animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      </div>

      {/* UZ CONTENT */}
      <div className="section">
        <div className="section-header">
          <div className="section-title">🇺🇿 O'zbek tilida</div>
          <span className="section-link" onClick={() => setActiveLang('uz')}>Barchasi →</span>
        </div>
        <div className="cards-row">
          {uzContent.map((item, i) => (
            <ContentCard key={item.id} item={item} style={{ animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      </div>

      {/* RU CONTENT */}
      <div className="section">
        <div className="section-header">
          <div className="section-title">🇷🇺 Rus tilida</div>
          <span className="section-link" onClick={() => setActiveLang('ru')}>Barchasi →</span>
        </div>
        <div className="cards-row">
          {ruContent.map((item, i) => (
            <ContentCard key={item.id} item={item} style={{ animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      </div>

      {/* SERIES */}
      <div className="section">
        <div className="section-header">
          <div className="section-title">📺 Mashhur seriallar</div>
          <span className="section-link" onClick={() => setActiveTab('series')}>Barchasi →</span>
        </div>
        <div className="cards-row">
          {seriesList.map((item, i) => (
            <ContentCard key={item.id} item={item} style={{ animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      </div>

      {/* MOVIES */}
      <div className="section">
        <div className="section-header">
          <div className="section-title">🎬 Eng yaxshi kinolar</div>
          <span className="section-link" onClick={() => setActiveTab('movies')}>Barchasi →</span>
        </div>
        <div className="cards-row">
          {moviesList.map((item, i) => (
            <ContentCard key={item.id} item={item} style={{ animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}