import { createContext, useContext, ReactNode } from 'react';

interface User {
  walletAddress?: string;
}

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AuthContext.Provider value={{ user: null }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};