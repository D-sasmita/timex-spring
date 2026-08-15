import { createContext, useState, useContext } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("timexUser");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    localStorage.setItem("timexUser", JSON.stringify(res.data));
    setUser(res.data);
    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await API.post("/auth/register", { username, email, password });
    localStorage.setItem("timexUser", JSON.stringify(res.data));
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("timexUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);