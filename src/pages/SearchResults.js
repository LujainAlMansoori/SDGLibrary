// This is the page when they first enter the searching section
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
  const [tooltip, setTooltip] = useState({ show: false, text: "", x: 0, y: 0 });

  const sdgTooltips = [
    "End poverty in all its forms everywhere.",
    "End hunger, achieve food security and improved nutrition, and promote sustainable agriculture.",
    "Ensure healthy lives and promote well-being for all at all ages.",
    "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.",
    "Achieve gender equality and empower all women and girls.",
    "Ensure availability and sustainable management of water and sanitation for all.",
    "Ensure access to affordable, reliable, sustainable, and modern energy for all.",
    "Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.",
    "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation.",
    "Reduce inequality within and among countries.",
    "Make cities and human settlements inclusive, safe, resilient, and sustainable.",
    "Ensure sustainable consumption and production patterns.",
    "Take urgent action to combat climate change and its impacts.",
    "Conserve and sustainably use the oceans, seas and marine resources for sustainable development.",
    "Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss.",
    "Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels.",
    "Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development.",
  ];

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

  const showTooltip = (index, e) => {
    const rect = e.target.getBoundingClientRect();
    const x = rect.left + window.scrollX + rect.width / 2;
    const y = rect.top + window.scrollY - 10; // Adjust to position above the SDG image
    setTooltip({
      show: true,
      text: sdgTooltips[index],
      x,
      y,
    });
  };

  const hideTooltip = () => {
    setTooltip({ show: false, text: "", x: 0, y: 0 });
  };

  return (
    <div>
      <h2 className="researchers-title">Search the SDGLibrary</h2>
      <div className="flex flex-col items-center justify-center">
        <div
          style={{
            marginBottom: "60px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TextField
            label="Search by title, author, publication, description, type, and, SDG tag..."
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              width: 900,
              marginTop: "-20px",
              marginBottom: "40px",
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
        {tooltip.show && (
          <div
            style={{
              position: "absolute",
              top: `${tooltip.y + 120}px`,
              left: `${tooltip.x - 140}px`,
              marginRight: "20px",
              backgroundColor: "white",
              padding: "20px 20px",
              borderRadius: "5px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
              zIndex: 30,

              whiteSpace: "normal", // Allows text to wrap
              maxWidth: "30ch",
              overflowWrap: "break-word",
            }}
          >
            {tooltip.text}
          </div>
        )}

        {/* SDG Images Mapping */}
        <div className="flex flex-wrap justify-center mt-5 w-full">
          {sdgImages.map((imagePath, index) => (
            <Link
              to={`/search?query=${encodeURIComponent(sdgTags[index])}`}
              key={index}
              onMouseEnter={(e) => showTooltip(index, e)}
              onMouseLeave={hideTooltip}
              style={{
                paddingLeft: index % 4 === 0 ? "140px" : "10px",
              }}
            >
              <img
                src={imagePath}
                alt={`SDG ${index + 1}`}
                style={{
                  width: "calc((100% / 4) - 90px)",
                  margin: "5px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  boxShadow: "2px 4px 10px rgba(0, 0, 2, 0.2)",
                }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
