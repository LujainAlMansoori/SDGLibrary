import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Paper from "@mui/material/Paper";
import "../components/style/titles.css";
import IconButton from "@mui/material/IconButton";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import "../components/style/noHover.css";
import emailjs from "emailjs-com";
import { useAuth } from "../contexts/AuthContexts";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { doc, getDoc } from "firebase/firestore";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Modal from "@mui/material/Modal";

export default function SearchResults() {
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Search by these attributes
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
      <div className="flex flex-col items-center justify-center">
        <p className="researchers-title">Materials</p>
        <TextField
          label="Search Materials..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            margin: "10px 10px",
            marginLeft: "40px",
            width: 1250,
          }}
          sx={{
            borderRadius: "20px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
            },
          }}
        />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", cursor: "pointer" }}>
        {filteredMaterials.map((material, index) => (
          <Paper
            key={index}
            elevation={3}
            style={{
              padding: "20px",
              margin: "10px 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: 1400,
              height: 100,
            }}
          >
            <p style={{ fontWeight: "bold", fontSize: "18px" }}>
              {material.title}
            </p>
          </Paper>
        ))}
      </div>
    </div>
  );
}
