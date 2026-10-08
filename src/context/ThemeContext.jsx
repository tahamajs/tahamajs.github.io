// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  accent: 'cyan',
  setTheme: () => {},
  setAccent: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem('tahamajs-theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [accent, setAccentState] = useState(() => {
    try {
      return localStorage.getItem('tahamajs-accent') || 'cyan';
    } catch {
      return 'cyan';
    }
  });

  const setTheme = (t) => {
    setThemeState(t);
    try {
      localStorage.setItem('tahamajs-theme', t);
    } catch {}
  };

  const setAccent = (a) => {
    setAccentState(a);
    try {
      localStorage.setItem('tahamajs-accent', a);
    } catch {}
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
    document.body.setAttribute('data-accent', accent);
  }, [accent]);

  return (
    <ThemeContext.Provider value={{ theme, accent, setTheme, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
