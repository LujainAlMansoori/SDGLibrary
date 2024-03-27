import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContexts";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const UserProfileContext = createContext();

export const useUserProfile = () => useContext(UserProfileContext);

export const UserProfileProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser?.uid) {
        const docRef = doc(db, "profiles", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  return (
    <UserProfileContext.Provider value={{ userProfile, setUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};
