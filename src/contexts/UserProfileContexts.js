// In UserProfileContext.js
import React, { createContext, useContext, useState } from "react";

const UserProfileContext = createContext();

export const useUserProfile = () => useContext(UserProfileContext);

export const UserProfileProvider = ({ children }) => {
  const [newUserProfile, setNewUserProfile] = useState(null);

  const updateUserProfile = (profile) => {
    setNewUserProfile(profile);
  };

  return (
    <UserProfileContext.Provider value={{ newUserProfile, updateUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};
