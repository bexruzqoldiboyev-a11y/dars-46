import { createContext, useContext, useState, useCallback } from 'react';

const Ctx = createContext(null);

export function NotificationProvider({ children }) {
  const [notes, setNotes] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setNotes(p => [...p, { id, message, type }]);
    setTimeout(() => setNotes(p => p.filter(n => n.id !== id)), duration);
  }, []);

  const remove = (id) => setNotes(p => p.filter(n => n.id !== id));

  return (
    <Ctx.Provider value={{ addNotification }}>
      {children}
      <div style={{ position:'fixed', top:80, right:20, zIndex:9999, display:'flex', flexDirection:'column', gap:10 }}>
        {notes.map(n => (
          <div key={n.id} onClick={() => remove(n.id)} style={{
            background: n.type==='success' ? '#1a3a2a' : n.type==='error' ? '#3a1a1a' : '#1e1e2a',
            border: `1px solid ${n.type==='success' ? '#2ecc71' : n.type==='error' ? '#e50914' : '#6c63ff'}`,
            borderRadius:12, padding:'12px 18px', color:'#fff',
            fontFamily:'var(--font)', fontSize:'0.9rem', cursor:'pointer',
            boxShadow:'0 8px 24px rgba(0,0,0,0.5)', animation:'slideLeft 0.3s ease',
            display:'flex', alignItems:'center', gap:10, maxWidth:300,
          }}>
            {n.type==='success' ? '✅' : n.type==='error' ? '❌' : 'ℹ️'} {n.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export const useNotification = () => useContext(Ctx);