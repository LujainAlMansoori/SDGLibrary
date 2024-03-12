import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Paper from "@mui/material/Paper";

export default function OneSearchResults() {
  const [searchParams] = useSearchParams();
  const [materials, setMaterials] = useState([]);
  const searchQuery = searchParams.get("query") || "";

  useEffect(() => {
    const fetchMaterials = async () => {
      const materialsCollection = collection(db, "materials");
      const materialsSnapshot = await getDocs(materialsCollection);
      const materialsList = materialsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMaterials(materialsList);
    };

    fetchMaterials();
  }, []);

  const filteredMaterials = materials.filter((material) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      material.title.toLowerCase().includes(searchLower) ||
      (material.author &&
        material.author.toLowerCase().includes(searchLower)) ||
      (material.category &&
        material.category.toLowerCase().includes(searchLower)) ||
      (material.date_published &&
        material.date_published.toLowerCase().includes(searchLower)) ||
      (material.description &&
        material.description.toLowerCase().includes(searchLower)) ||
      (material.institution &&
        material.institution.toLowerCase().includes(searchLower)) ||
      (material.journalName &&
        material.journalName.toLowerCase().includes(searchLower)) ||
      (material.publisher &&
        material.publisher.toLowerCase().includes(searchLower)) ||
      (material.tags && material.tags.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div>
      <h2>Search Results for: {searchQuery}</h2>
      <div>
        {filteredMaterials.map((material, index) => (
          <Paper
            key={index}
            elevation={3}
            style={{ padding: "20px", margin: "10px" }}
          >
            <p style={{ fontWeight: "bold", fontSize: "18px" }}>
              {material.title}
            </p>
            {/* Display other fields as needed */}
          </Paper>
        ))}
      </div>
    </div>
  );
}
