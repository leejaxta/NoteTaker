import { createContext, useEffect, useState } from "react";
import { loginApi, logoutApi, getMeApi } from "../api/auth.api";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    await loginApi(credentials);
    const res = await getMeApi();
    console.log("From aurh", res);

    setUser(res);
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMeApi();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
