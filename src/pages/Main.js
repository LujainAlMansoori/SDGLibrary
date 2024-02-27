import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the path as necessary

export default function Main() {
  const { currentUser } = useAuth(); // Get the current user from the AuthContext
  const [profileofCurrentUser, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (currentUser) {
        const profileDoc = await getDoc(doc(db, "profiles", currentUser.uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data());
        } else {
          console.log("No such profile!");
        }
      }
    }

    fetchProfile();
  }, [currentUser]);

  return (
    <div>
      <h2>TESTING PURPOSES Home Page</h2>
      {profileofCurrentUser && (
        <div>
          <p>Email: {currentUser.email}</p>
          <p>First Name: {profileofCurrentUser.firstName}</p>
          <p>Last Name: {profileofCurrentUser.lastName}</p>
          <p>Title: {profileofCurrentUser.title}</p>
        </div>
      )}
    </div>
  );
}
