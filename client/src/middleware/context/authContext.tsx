import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

interface User {
  id: string;
  name: string;
  day: string;
  email: string;
  types: string;
  subChurchID?: string;
  phoneNumber: string;
}

// Create an authentication context
const AuthContext = createContext<{
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
} | undefined>(undefined);


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if there is user data in localStorage when the component mounts
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      // Parse and set the user data from localStorage
      setUser(JSON.parse(storedUserData));
      setIsAuthenticated(true);
     
    }
  }, []);

  // Function to handle login
  const login = (userData: User) => {
    localStorage.setItem('userData', JSON.stringify(userData)); // Store user data
    setUser(userData);
    setIsAuthenticated(true);
    // console.log("User input in:",user);

  };

  // Function to handle logout
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('userData'); // Remove user data from storage

  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
// Custom hook to access the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
