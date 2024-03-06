import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken_] = useState(localStorage.getItem("token"));
  const [userData, setUserData_] = useState(localStorage.getItem("TuneLinkUser"))
  console.log(localStorage.getItem("TuneLinkUser"))
  const setToken = (newToken) => {
    setToken_(newToken);
  };

  const setUserData = (newUser) => {
    console.log(newUser)
    localStorage.setItem("TuneLinkUser",newUser)
    setUserData_(newUser);
  }


  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token')
    }
    
  }, [token,userData]);

  const fetchWithToken = async (url, options = {}) => {
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  };

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      fetchWithToken,
      setUserData,
      userData
    }),
    [token]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
