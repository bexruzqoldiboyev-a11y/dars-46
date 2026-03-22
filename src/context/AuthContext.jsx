import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sevimliplay_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    localStorage.setItem('sevimliplay_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('sevimliplay_user');
    setUser(null);
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('sevimliplay_users') || '[]');
    const exists = users.find(u => u.email === userData.email);
    if (exists) return { error: "Bu email allaqachon ro'yxatdan o'tgan!" };
    users.push(userData);
    localStorage.setItem('sevimliplay_users', JSON.stringify(users));
    login(userData);
    return { success: true };
  };

  const loginWithCredentials = (email, password) => {
    const users = JSON.parse(localStorage.getItem('sevimliplay_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { error: "Email yoki parol noto'g'ri!" };
    login(user);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loginWithCredentials }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);