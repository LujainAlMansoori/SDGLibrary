import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore'; 
import db from "../firebase";
import '../components/style/Form.css';


export default function NewMaterial() {
    // State of the form fields 
    
    const [materialDetails, setMaterialDetails] = useState({
        title: "",
        author: "",
        date_published: "", 
        description: "", 
        link: ""
    });

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMaterialDetails({
            ...materialDetails,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Add a new document with the data from the form
            await addDoc(collection(db, "materials"), materialDetails);
            console.log("Document successfully written!");
            // Reset the form 
            setMaterialDetails({
                title: "",
                author: "",
                date_published: "", 
                description: "", 
                link: ""
            });
        } catch (error) {
            console.error("Error writing document: ", error);
        }
    };

    return (

            <div className="form-container"> 
                <div className="title"> Add Material to the Database</div>
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
            className="form-field" // Add class name for styling
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
      
<div className="button-container">
    <button type="submit" className="submit-button">Submit</button>
</div>

 
    </form>
        </div>
    );
}
