import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const res = await fetch('https://task-manager-backend-xj6y.onrender.com/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const userData = await res.json();
          if (res.ok) {
            setUser(userData); 
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await fetch('https://task-manager-backend-xj6y.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user); 
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    setUser(null); 
    localStorage.removeItem('authToken'); 
  };

  const signup = async (userData) => {
    try {
      const res = await fetch('https://task-manager-backend-xj6y.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user); 
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};