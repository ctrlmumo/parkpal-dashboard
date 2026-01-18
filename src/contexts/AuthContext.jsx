import { createContext, useContext, useState, useCallback } from 'react';

/**
 * User structure matching database schema:
 * - id: INT (user id)
 * - username: VARCHAR(100)
 * - email: VARCHAR(150)
 * - is_admin: BOOLEAN
 * - created_at: DATETIME
 */

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('parkhub_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email, password, role) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: Math.floor(Math.random() * 10000),
      username: email.split('@')[0],
      email,
      is_admin: role === 'admin',
      created_at: new Date().toISOString(),
    };
    
    setUser(mockUser);
    localStorage.setItem('parkhub_user', JSON.stringify(mockUser));
    return true;
  }, []);

  const signup = useCallback(async (name, email, password, role) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: Math.floor(Math.random() * 10000),
      username: name,
      email,
      is_admin: role === 'admin',
      created_at: new Date().toISOString(),
    };
    
    setUser(mockUser);
    localStorage.setItem('parkhub_user', JSON.stringify(mockUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('parkhub_user');
  }, []);

  // Helper to get display name
  const getUserDisplayName = () => user?.username || 'User';
  
  // Helper to check role
  const getUserRole = () => user?.is_admin ? 'admin' : 'driver';

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      getUserDisplayName,
      getUserRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
