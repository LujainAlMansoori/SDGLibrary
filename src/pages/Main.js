import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the path as necessary
import "../components/style/Main.css";

export default function Main() {
  return (
    <div className="main-container">
      <div className="content">
        <h1>Welcome to the SDGLibrary</h1>
        <div className="sdg-shop-section">
          <h2>A One-Stop SDG Shop, Access Resources and Researchers</h2>
        </div>
        <div className="who-are-we">
          <h2>Who Are We?</h2>
          <p>
            We represent Sub-project 1 of the research cluster, 'SDGED and
            Global Citizenship: Enhancing Qatar’s Nested Power in the Global
            Arena'. We aim to:
          </p>
          <p>
            <ol>
              <li>
                Map the entire constellation of international organizations
                contributing to SDGs and SDG education.
              </li>
              <li>
                Gather data on selected country responses and policy frameworks
                around global citizenship education.
              </li>
              <li>
                Undertake three local case studies of SDG education
                "implementation value chains."
              </li>
            </ol>
          </p>
        </div>
        <div className="sdg-library-description">
          <h2>What is the SDGLibrary?</h2>
          <p>
            The SDGLibrary aims to provide an accessible centralized platform
            for all SDGED and GCED resources and connect researchers.
          </p>
          <p>
            With the SDGLibrary, you can:
            <ol>
              <li>
                Search through our SDG database for the material of your choice.
              </li>
              <li>
                Connecting with our SDG researchers by joining the SDG
                community.
              </li>
            </ol>
          </p>
        </div>
      </div>
    </div>
  );
}
//   const { currentUser } = useAuth(); // Get the current user from the AuthContext
//   const [profileofCurrentUser, setProfile] = useState(null);

//   useEffect(() => {
//     async function fetchProfile() {
//       if (currentUser) {
//         const profileDoc = await getDoc(doc(db, "profiles", currentUser.uid));
//         if (profileDoc.exists()) {
//           setProfile(profileDoc.data());
//         } else {
//           console.log("No such profile!");
//         }
//       }
//     }

//     fetchProfile();
//   }, [currentUser]);

//   return (
//     <div>
//       <div className="main-container"></div>
//       <h2>TESTING PURPOSES Home Page</h2>
//       {profileofCurrentUser && (
//         <div>
//           <p>Email: {currentUser.email}</p>
//           <p>First Name: {profileofCurrentUser.firstName}</p>
//           <p>Last Name: {profileofCurrentUser.lastName}</p>
//           <p>Title: {profileofCurrentUser.title}</p>
//         </div>
//       )}
//     </div>
//   );
// }
