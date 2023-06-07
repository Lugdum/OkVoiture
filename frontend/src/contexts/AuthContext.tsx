import React, {
  createContext,
  useState,
  useEffect,
  FC,
  ReactNode,
} from "react";
import { User } from "../types";

// Auth context
interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  privilege: number;
  login: (user: User, privilege: number) => void;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  privilege: 0,
  login: () => {},
  logout: () => {},
});

// Context properties
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider
const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  // Connextion state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [privilege, setPrivilege] = useState(0);

  // Check local storage to get connection infos
  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    const privilegeFromStorage = localStorage.getItem("privilege");

    if (userFromStorage && privilegeFromStorage) {
      setUser(JSON.parse(userFromStorage));
      setIsAuthenticated(true);
      setPrivilege(Number(privilegeFromStorage));
    }
  }, []);

  // Login functions
  const login = (user: User, privilege: number) => {
    setIsAuthenticated(true);
    setUser(user);
    setPrivilege(privilege);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("privilege", privilege.toString());
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setPrivilege(0);
    localStorage.removeItem("user");
    localStorage.removeItem("privilege");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, privilege, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
