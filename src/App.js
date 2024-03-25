import { onSnapshot, collection } from "@firebase/firestore";
import { useEffect, useState } from "react";
import db from "./firebase";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBarSimple from "./components/NavBar.js";
import NavBar from "./components/NavBar copy.js";
import { AuthProvider } from "./contexts/AuthContexts.js";
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import "./components/style/Footer.css";

// Pages imported
import SearchResults from "./pages/SearchResults.js";

// Main is the home page
import Main from "./pages/Main.js";
import NewMaterial from "./pages/NewMaterial";
import NewMaterial2 from "./pages/NewMaterial copy.jsx";
import NoPage from "./pages/NoPage.js";
import Researchers from "./pages/Researchers.js";
import Signup from "./pages/Signup.js";
import Login from "./pages/Login.js";
import CreateProfile from "./pages/createProfile.js";
import AboutUs from "./pages/PageAboutUs.js";
import AboutSDGLibrary from "./pages/AboutSDGLibrary.js";
import SearchPage from "./pages/SearchPage";

import Footer from "./components/pageFooter.js";
import { app } from "./firebase";
import Settings from "./pages/Settings.jsx";

function App() {
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);

  const [materials, setMaterials] = useState([
    { name: "Loading...", id: "initial" },
  ]);
  // This logs the state of the snapshot in the console
  console.log(materials);

  useEffect(() => {
    // This takes a snapshot of the DB and displays the material
    const unsubscribe = onSnapshot(collection(db, "document-1"), (snapshot) => {
      setMaterials(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  }, []);

  return (
    // Below shows the navigation bar and sets the routes of every page
    <AuthProvider>
      <div>
        <BrowserRouter>
          <div className="app-container">
            <NavBarSimple />
            {/* <NavBar /> */}
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/home" element={<Main />} />
                {/* <Route path="/searchresults" element={<SearchResults />} /> */}
                <Route path="/newmaterial" element={<NewMaterial />} />
                {/* <Route path="/newmaterial" element={<NewMaterial2 />} /> */}
                <Route path="/researchers" element={<Researchers />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="login" element={<Login />} />
                <Route path="/createprofile" element={<CreateProfile />} />
                <Route path="/AboutSDGLibrary" element={<AboutSDGLibrary />} />
                <Route path="/aboutUs" element={<AboutUs />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NoPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
