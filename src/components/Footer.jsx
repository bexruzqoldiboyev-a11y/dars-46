import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  const go = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <div className="footer-brand-name" style={{ cursor: 'pointer' }} onClick={() => go('/')}>
            SevimliPlay
          </div>
          <div className="footer-desc">
            O'zbekistondagi eng yaxshi kino va serial platformasi. 4K sifatida, o'zbek va rus tillarida minglab kontent.
          </div>
        </div>

        <div className="footer-col">
          <h4>Kategoriyalar</h4>
          <ul>
            <li onClick={() => go('/?tab=movies')}>🎬 Kinolar</li>
            <li onClick={() => go('/?tab=series')}>📺 Seriallar</li>
            <li onClick={() => go('/search?q=animatsiya')}>🎨 Animatsiyalar</li>
            <li onClick={() => go('/search?q=tarix')}>📽️ Hujjatli filmlar</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Tillar</h4>
          <ul>
            <li onClick={() => go('/?lang=uz')}>🇺🇿 O'zbek tili</li>
            <li onClick={() => go('/?lang=ru')}>🇷🇺 Rus tili</li>
            <li onClick={() => go('/search?q=ingliz')}>🇬🇧 Ingliz tili</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Kompaniya</h4>
          <ul>
            <li onClick={() => alert('SevimliPlay — O\'zbekistonning eng yaxshi kino platformasi!')}>ℹ️ Biz haqimizda</li>
            <li onClick={() => alert('Aloqa: info@sevimliplay.uz\nTel: +998 90 000 00 00')}>📞 Aloqa</li>
            <li onClick={() => alert('Maxfiylik siyosati: Sizning ma\'lumotlaringiz xavfsiz saqlanadi.')}>🔒 Maxfiylik</li>
            <li onClick={() => alert('Yordam kerakmi?\nEmail: support@sevimliplay.uz')}>🆘 Yordam</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">
          © 2025 SevimliPlay. Barcha huquqlar himoyalangan.
        </div>
        <div className="footer-copy">
          🎬 4K · O'zbek · Rus · HD
        </div>
      </div>
    </footer>
  );
}