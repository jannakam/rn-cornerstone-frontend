// ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { useColorScheme } from "react-native";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === "dark");

  useEffect(() => {
    setIsDark(systemColorScheme === "dark");
  }, [systemColorScheme]);

  const toggleTheme = (value) => {
    setIsDark(value);
  };

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
