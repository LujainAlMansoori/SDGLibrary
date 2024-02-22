import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // make sure this import points to your firebase config file
import { collection, getDocs } from "firebase/firestore";
import Paper from "@mui/material/Paper";
import "../components/style/titles.css";

export default function Researchers() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const profilesCollection = collection(db, "profiles");
      const profilesSnapshot = await getDocs(profilesCollection);
      const profilesList = profilesSnapshot.docs.map((doc) => doc.data());
      setProfiles(profilesList);
    };

    fetchProfiles();
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <p className="researchers-title">Researchers</p>
      </div>
      {profiles.map((profile, index) => (
        <Paper
          key={index}
          elevation={3}
          style={{
            padding: "20px",
            margin: "10px 10px",
            display: "flex",
            alignItems: "center",
            width: 1400,
            height: 100,
          }}
        >
          <img
            src={profile.profileImage}
            alt={`${profile.firstName} ${profile.lastName}`}
            style={{
              borderRadius: "50%",
              marginRight: "40px",
              marginLeft: "40px",

              width: "80px",
              height: "80px",
            }}
          />
          <div>
            <div>{`${profile.title} ${profile.firstName} ${profile.lastName}`}</div>
            <br></br>
            <div>{profile.role}</div>
          </div>
        </Paper>
      ))}
    </div>
  );
}
