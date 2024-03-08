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
import { Link } from "react-router-dom";

import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export default function SearchResults() {
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Hook for navigation

  const sdgTags = [
    "SDG1 - No Poverty",
    "SDG2 - Zero Hunger",
    "SDG3 - Good Health and Well-being",
    "SDG4 - Quality Education",
    "SDG5 - Gender Equality",
    "SDG6 - Clean Water and Sanitation",
    "SDG7 - Affordable and Clean Energy",
    "SDG8 - Decent Work and Economic Growth",
    "SDG9 - Industry, Innovation and Infrastructure",
    "SDG10 - Reduced Inequalities",
    "SDG11 - Sustainable Cities and Communities",
    "SDG12 - Responsible Consumption and Production",
    "SDG13 - Climate Action",
    "SDG14 - Life Below Water",
    "SDG15 - Life on Land",
    "SDG16 - Peace, Justice and Strong Institutions",
    "SDG17 - Partnerships for the Goals",
  ];

  const sdgImages = Array.from(
    { length: 17 },
    (_, i) => `/SDG/SDG${i + 1}.png`
  );

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
      material.author.toLowerCase().includes(searchLower) ||
      material.category.toLowerCase().includes(searchLower) ||
      material.date_published.toLowerCase().includes(searchLower) ||
      material.description.toLowerCase().includes(searchLower) ||
      material.institution.toLowerCase().includes(searchLower) ||
      material.journalName.toLowerCase().includes(searchLower) ||
      material.publisher.toLowerCase().includes(searchLower) ||
      material.tags.some((tag) => tag.toLowerCase().includes(searchLower))
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

      {/* Add SDG images below search results */}
      <div className="flex flex-wrap justify-center mt-5">
        {sdgImages.map((imagePath, index) => (
          <Link
            to={`/search?query=${encodeURIComponent(sdgTags[index])}`}
            key={index}
          >
            <img
              src={imagePath}
              alt={`SDG ${index + 1}`}
              style={{
                width: "calc((100% / 6) - 10px)", // Adjust width to fit 6 images in a row, accounting for margin
                margin: "5px", // Add some space around the images
                borderRadius: "10px", // Round the edges of the images
                cursor: "pointer", // Change cursor to pointer on hover
              }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
