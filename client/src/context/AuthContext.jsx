import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { getErrorMessage } from "../utils/errors";

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  updateUser: () => {},
});

const fetchSessionUser = async () => {
  const response = await api.get("/api/auth/me");
  return response.data.data.user;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const restoreSession = async () => {
      try {
        const nextUser = await fetchSessionUser();

        if (!ignore) {
          setUser(nextUser);
        }
      } catch {
        if (!ignore) {
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      ignore = true;
    };
  }, []);

  const register = async (formData) => {
    try {
      await api.post("/api/auth/register", formData);
      const nextUser = await fetchSessionUser();
      setUser(nextUser);
      return nextUser;
    } catch (error) {
      throw new Error(getErrorMessage(error), { cause: error });
    }
  };

  const login = async (formData) => {
    try {
      await api.post("/api/auth/login", formData);
      const nextUser = await fetchSessionUser();
      setUser(nextUser);
      return nextUser;
    } catch (error) {
      throw new Error(getErrorMessage(error), { cause: error });
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      setUser(null);
    } catch (error) {
      throw new Error(getErrorMessage(error), { cause: error });
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    updateUser: setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
