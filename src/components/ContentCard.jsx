import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

export default function ContentCard({ item, style }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const fav = isFavorite(item.id);

  return (
    <div className="card" style={style} onClick={() => navigate(`/movie/${item.id}`)}>
      <img
        className="card-poster"
        src={item.poster}
        alt={item.title}
        loading="lazy"
        onError={e => {
          e.target.src = `https://via.placeholder.com/250x375/16161f/e50914?text=${encodeURIComponent(item.title)}`;
        }}
      />

      <span className={`card-badge ${item.type === 'series' ? 'series' : ''}`}>
        {item.type === 'series' ? 'SERIAL' : '4K'}
      </span>
      <span className="card-badge lang">{item.lang === 'uz' ? "O'Z" : 'RU'}</span>
      <div className="card-rating">⭐ {item.rating}</div>

      {/* Favorite button */}
      <button
        onClick={e => { e.stopPropagation(); toggleFavorite(item); }}
        style={{
          position: 'absolute', top: 10, right: 44,
          background: fav ? 'var(--accent)' : 'rgba(0,0,0,0.7)',
          border: fav ? 'none' : '1px solid var(--border)',
          borderRadius: '50%', width: 30, height: 30,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '0.85rem',
          transition: 'all 0.2s', backdropFilter: 'blur(4px)',
          zIndex: 3,
        }}
        title={fav ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish"}
      >
        {fav ? '❤️' : '🤍'}
      </button>

      <div className="card-overlay">
        <div className="card-play-btn">▶</div>
        <div className="card-info">
          <div className="card-title">{item.title}</div>
          <div className="card-meta">
            <span>{item.year}</span>
            {item.type === 'series'
              ? <span>{item.seasons} mavsum</span>
              : <span>{item.duration}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}