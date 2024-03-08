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
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export default function SearchResults() {
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`); // Navigate to the search results page
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
      (material.tags &&
        material.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
    );
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="researchers-title">Materials</p>
      <TextField
        label="Search..."
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
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
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}
