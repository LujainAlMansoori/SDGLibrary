import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { doc, getDoc } from "firebase/firestore";
import "../components/style/Main.css";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Main() {
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(
    location.state?.success || ""
  );

  console.log(location.state);
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const handleSearchResultsClick = () => {
    navigate("/searchresults");
  };
  const handleResearchersClick = () => {
    if (currentUser) {
      navigate("/researchers");
    } else {
      navigate("/signup");
    }
  };
  return (
    <div>
      {successMessage && <div className="confirmMessage">{successMessage}</div>}
      <div className="main-container">
        <div className="content">
          <h1 style={{ color: "#17386E" }}>Welcome to the SDGLibrary</h1>
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
                  Gather data on selected country responses and policy
                  frameworks around global citizenship education.
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
          </div>
        </div>

        <div className="buttons-content-searching">
          <div className="buttons-heading">
            <h2 style={{ color: "#17386E" }}>Search</h2>
          </div>
          <p>
            Search through our SDG database for the material of your choice. You
            can search by SDG or keyword and filter according to your preferred
            categories.
          </p>

          <Button
            variant="contained"
            sx={{
              width: 400,
            }}
            onClick={handleSearchResultsClick}
          >
            Search the SDGLibrary
          </Button>
        </div>

        <div className="buttons-content-researchers">
          <div className="buttons-heading">
            <h2 style={{ color: "#17386E" }}>Connect</h2>
          </div>
          <p style={{ marginBottom: "33px" }}>
            Once you create an account, you can search, network and connect with
            our SDG researchers.
          </p>

          <Button
            variant="contained"
            sx={{
              width: 400,
            }}
            onClick={handleResearchersClick}
          >
            Connect with Researchers
          </Button>
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
