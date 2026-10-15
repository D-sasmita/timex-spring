import { createContext, useState, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import API from "../api/axios";
import { clearCart, fetchCart } from "../redux/cartSlice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("timexUser");

    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem("timexUser");
      return null;
    }
  });

  // Load the authenticated user's database cart after login
  // and whenever an existing session is restored on refresh.
  useEffect(() => {
    if (user?.token) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("timexUser", JSON.stringify(res.data));
    dispatch(clearCart());
    setUser(res.data);

    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await API.post("/auth/register", {
      username,
      email,
      password,
    });

    localStorage.setItem("timexUser", JSON.stringify(res.data));
    dispatch(clearCart());
    setUser(res.data);

    return res.data;
  };

  const logout = () => {
    dispatch(clearCart());
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