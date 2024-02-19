// To access the user anywhere
import React, { useContext, useState, useEffect } from "react";

import { auth, dosignup, dologin, dologout } from "../firebase";

const AuthContext = React.createContext();

// Use the auth
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  //signup user

  function signup(email, password) {
    return dosignup(email, password);
  }

  function login(email, password) {
    // log in
    return dologin(email, password);
  }

  function logout() {
    return dologout();
  }
  //firebase sets a user, it will notify you when user gets set
  //allows us to set the user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Dont render application unless there is a user set
      setCurrentUser(user);
      setLoading(false);
    });
    // unsubscribe from the listener onAuthStateChanged
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
