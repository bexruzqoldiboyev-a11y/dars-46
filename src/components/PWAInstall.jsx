import { useState, useEffect } from 'react';

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa_dismissed');
    if (dismissed) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShow(true), 3000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShow(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('pwa_dismissed', '1');
  };

  if (!show) return null;

  return (
    <div className="pwa-banner">
      <div style={{ fontSize: '2rem' }}>📱</div>
      <div className="pwa-banner-text">
        <div className="pwa-banner-title">SevimliPlay ilovasini o'rnating</div>
        <div className="pwa-banner-desc">Telefoningizga yuklab, oflayn ham ishlating</div>
      </div>
      <button className="pwa-install-btn" onClick={handleInstall}>O'rnatish</button>
      <button className="pwa-close-btn" onClick={handleDismiss}>✕</button>
    </div>
  );
}