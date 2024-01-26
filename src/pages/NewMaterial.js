import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import db, { storage } from "../firebase"; 
import '../components/style/Form.css';

export default function NewMaterial() {
    const [materialDetails, setMaterialDetails] = useState({
        title: "",
        author: "",
        date_published: "",
        description: "",
        link: "",
    });
    const [file, setFile] = useState(null); 
    const [inputKey, setInputKey] = useState(Date.now());

  
    const handleChange = (e) => {
        if (e.target.type === 'file') {
            setFile(e.target.files[0]); // Set the file
        } else {
            const { name, value } = e.target;
            setMaterialDetails({
                ...materialDetails,
                [name]: value
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // First, upload the file if it exists
        let fileUrl = '';
        if (file) {
            const fileStorageRef = storageRef(storage, `documents/${file.name}`);
            const uploadResult = await uploadBytes(fileStorageRef, file);
            fileUrl = await getDownloadURL(uploadResult.ref);
        }

        // Then, add the document reference to the materialDetails object
        const finalMaterialDetails = {
            ...materialDetails,
            documentUrl: fileUrl, // Include the file URL here
        };

        // Finally, add the new material details to Firestore
        try {
            await addDoc(collection(db, "materials"), finalMaterialDetails);
            console.log("Document successfully written!");

            // Reset the form and file state
            setMaterialDetails({
                title: "",
                author: "",
                date_published: "",
                description: "",
                link: "",
                
                
            });
            setFile(null);
            setInputKey(Date.now());
        } catch (error) {
            console.error("Error writing document: ", error);
        }
    };

    return (
        <div className="form-container"> 
            <div className="title">New Material Page</div>
            <form onSubmit={handleSubmit}>
       <div className="form-titles"> Title</div>
        <input 
            type="text"
            name="title"
            placeholder="Title"
            value={materialDetails.title}
            onChange={handleChange}
            className="form-field" 
        />
          <div className="form-titles"> Author</div>
        <input 
            type="text"
            name="author"
            placeholder="Author"
            value={materialDetails.author}
            onChange={handleChange}
            className="form-field" 
        />
         <div className="form-titles"> Date Published</div>
        <input 
            type="date"
            name="date_published"
            placeholder="Date Published"
            value={materialDetails.date_published}
            onChange={handleChange}
            className="form-field" 
        />
        <div className="form-titles"> Description</div>
        <textarea 
            name="description"
            placeholder="Description"
            value={materialDetails.description}
            onChange={handleChange}
            className="form-field" 
        />
           <div className="form-titles"> Link</div>
        <input 
            type="text"
            name="link"
            placeholder="Link"
            value={materialDetails.link}
            onChange={handleChange}
            className="form-field" 
        />
        
        <div className="form-titles"> File</div>
                <input 
                    type="file" 
                    name="file_upload"
                    onChange={handleChange} 
                    className="form-field" 
                    style={{ justifyContent: 'center' }} 
                    key={inputKey}
                />
                
                <div className="submit-button-container">
              <button type="submit" className="submit-button" >Submit</button>
</div>
            </form>
        </div>
    );
}
