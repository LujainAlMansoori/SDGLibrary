import { onSnapshot, collection } from '@firebase/firestore';
import { useEffect, useState } from "react";
import db from "./firebase";


function App() {
  const [ materials, setMaterials ] = useState([]);
  //console from the state 
  console.log(materials);
  
 
  
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "document-1"), (snapshot) => {
      
      setMaterials(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    // snapshot.docs.forEach((doc) => {

        // console.log(`Document ID: ${doc.id}`);
        // console.log(`Author: ${doc.data().Author}`);
        // console.log(`Title: ${doc.data().Title}`);
        // console.log(`URL: ${doc.data().URL}`);
    //  });
    });
    return unsubscribe;
  }, []);
  
   
    
 
  return (
    
      <div className="materials-list">
        {materials.map((material) => (
          <div key={material.id} className="material">
            <div><strong>ID:</strong> {material.id}</div>
            <div><strong>Title:</strong> {material.Title}</div>
            <div><strong>Author:</strong> {material.Author}</div>
            <div><strong>URL:</strong> <a href={material.URL} target="_blank" rel="noopener noreferrer">{material.URL}</a></div>
          </div>
        ))}
      </div>
    </div>
  );

}

export default App;
