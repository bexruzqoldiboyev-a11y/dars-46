import { useNavigate } from 'react-router-dom';

export default function ContentCard({ item, style }) {
  const navigate = useNavigate();

  return (
    <div
      className="card"
      style={style}
      onClick={() => navigate(`/movie/${item.id}`)}
    >
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