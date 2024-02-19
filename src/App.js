import { onSnapshot, collection } from "@firebase/firestore";
import { useEffect, useState } from "react";
import db from "./firebase";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SearchResults from "./pages/SearchResults.js";
import Main from "./pages/Main.js";
import NewMaterial from "./pages/NewMaterial.js";
import NoPage from "./pages/NoPage.js";
import Researchers from "./pages/Researchers.js";
import Signup from "./pages/Signup.js";
import Login from "./pages/Login.js";
import NavBar from "./components/NavBar.js";
import { AuthProvider } from "./contexts/AuthContexts.js";


function App() {
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
          <NavBar />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/home" element={<Main />} />
            <Route path="/searchresults" element={<SearchResults />} />
            <Route path="/newmaterial" element={<NewMaterial />} />
            <Route path="/researchers" element={<Researchers />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </BrowserRouter>

        <div>
          {/*  This is just temporary to show all the materials in the DB */}
          <div className="materials-list">
            {materials.map((material) => (
              <div key={material.id} className="material">
                <div>
                  <strong>ID:</strong> {material.id}
                </div>
                <div>
                  <strong>Title:</strong> {material.Title}
                </div>
                <div>
                  <strong>Author:</strong> {material.Author}
                </div>
                <div>
                  <strong>URL:</strong>{" "}
                  <a
                    href={material.URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {material.URL}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
