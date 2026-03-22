import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import ContentCard from '../components/ContentCard';
import { ALL_CONTENT } from '../data/content';

const ALIASES = {
  'serial': 'series', 'seriallar': 'series',
  'kino': 'movie', 'kinolar': 'movie', 'film': 'movie',
  'fantastik': 'fantastika', 'fantastika': 'fantastika',
  'komediya': 'komediya', 'kulgili': 'komediya',
  "qo'rqinchli": 'dahshat', 'dahshat': 'dahshat', 'horror': 'dahshat',
  'harakat': 'harakat', 'action': 'harakat', 'jangari': 'harakat',
  'drama': 'drama', 'triller': 'triller',
  'sarguzasht': 'sarguzasht',
  'romantik': 'romantika', 'romantika': 'romantika', 'sevgi': 'romantika',
  'kriminal': 'kriminal', 'jinoyat': 'kriminal',
  'animatsiya': 'animatsiya', 'multfilm': 'animatsiya', 'multik': 'animatsiya',
  'fantaziya': 'fantaziya', 'tarix': 'tarix', 'tarixiy': 'tarix',
  'uzbek': 'uz', "o'zbek": 'uz', "o'zbekcha": 'uz',
  'rus': 'ru', 'ruscha': 'ru',
};

function searchContent(query) {
  if (!query.trim()) return ALL_CONTENT;
  const q = query.toLowerCase().trim();
  const mapped = ALIASES[q] || q;
  return ALL_CONTENT.filter(c => {
    const titleMatch = c.title.toLowerCase().includes(q);
    const genreMatch = c.genre.some(g =>
      g.toLowerCase().includes(q) || g.toLowerCase().includes(mapped)
    );
    const descMatch = c.desc.toLowerCase().includes(q);
    const typeMatch = (mapped === 'series' && c.type === 'series') || (mapped === 'movie' && c.type === 'movie');
    const langMatch = (mapped === 'uz' && c.lang === 'uz') || (mapped === 'ru' && c.lang === 'ru');
    return titleMatch || genreMatch || descMatch || typeMatch || langMatch;
  });
}

const HINTS = ['serial', 'kino', 'fantastika', 'drama', 'harakat', 'komediya', "o'zbek", 'rus', 'triller', 'animatsiya'];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const results = searchContent(query);

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val) setSearchParams({ q: val });
    else setSearchParams({});
  };

  const setHint = (h) => { setQuery(h); setSearchParams({ q: h }); };

  return (
    <div className="search-page">
      <Header />
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 20 }}>🔍 Qidiruv</h1>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {HINTS.map(h => (
          <button key={h} onClick={() => setHint(h)} style={{
            padding: '6px 14px', borderRadius: 20,
            border: '1px solid var(--border)',
            background: query === h ? 'var(--accent)' : 'var(--bg-card)',
            color: query === h ? '#fff' : 'var(--text-muted)',
            cursor: 'pointer', fontSize: '0.82rem',
            fontFamily: 'var(--font)', fontWeight: 600, transition: 'all 0.2s',
          }}>{h}</button>
        ))}
      </div>

      <div className="search-page-input-wrap">
        <span className="search-icon-big">🔍</span>
        <input
          type="text"
          placeholder="serial, fantastika, drama, o'zbek..."
          value={query}
          onChange={handleInput}
          autoFocus
        />
        {query && (
          <button onClick={() => { setQuery(''); setSearchParams({}); }}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem', padding: 4 }}>
            ✕
          </button>
        )}
      </div>

      <div className="search-results-count">
        {query ? `"${query}" bo'yicha ${results.length} ta natija topildi` : `Jami ${ALL_CONTENT.length} ta kontent`}
      </div>

      {results.length > 0 ? (
        <div className="cards-row">
          {results.map((item, i) => (
            <ContentCard key={item.id} item={item} style={{ animationDelay: `${i * 0.04}s` }} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results-icon">😔</div>
          <h3>Hech narsa topilmadi</h3>
          <p>Masalan: <strong>serial</strong>, <strong>fantastika</strong>, <strong>drama</strong>, <strong>o'zbek</strong> deb qidiring</p>
        </div>
      )}
    </div>
  );
}