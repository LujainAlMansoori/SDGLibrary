//This is the page for individual search results
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get("query") || "";
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery) {
        const materialsRef = collection(db, "materials");
        const querySnapshot = await getDocs(materialsRef);
        const allResults = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const filteredResults = allResults.filter((material) => {
          return (
            material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            material.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            material.date_published
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            material.category
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            material.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            ) ||
            material.institution
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            material.journalName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            material.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            material.publisher.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });
        console.log("Filtered Results:", filteredResults);
        setResults(filteredResults);
      } else {
        setResults([]);
      }
    };

    fetchResults();
    setSelectedMaterial(null); // Reset the selectedMaterial state when the component is mounted
  }, [searchQuery]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchInput.trim())}`);
      setSearchQuery(searchInput.trim());
      setSearchParams({ query: searchInput.trim() });
    }
  };

  const handleMaterialClick = (material, event) => {
    // Check if the event was triggered by clicking the "View the Resource" button
    if (event && event.target.closest(".view-resource-btn")) {
      // If yes, do not open the material popup
      return;
    }
    setSelectedMaterial(material);
  };

  const handleClosePopup = () => {
    setSelectedMaterial(null);
  };

  const MaterialInfoPopup = ({ material, onClose }) => {
    if (!material) return null;

    const handleLinkClick = () => {
      window.open(material.link, "_blank");
    };

    return (
      <div
        className="popup-container"
        style={{
          position: "fixed",
          top: 69,
          right: 0,
          bottom: 0,
          width: "75%",
          backgroundColor: "white",
          zIndex: 1000,
          overflowY: "auto",
          border: "1px solid #e0e0e0",
          boxShadow:
            "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            left: 40,
            cursor: "pointer",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            backgroundColor: "#f0f0f0",
            color: "black",
            fontSize: "10px",
          }}
        >
          X
        </button>

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />

        <button
          onClick={(event) => {
            event.stopPropagation(); // Prevent the event from propagating to the Paper component

            handleLinkClick();
          }}
          style={{
            position: "absolute",
            top: 20,
            right: 50,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            backgroundColor: "#a2cbe7",
            color: "black",
            fontSize: "13px",
            padding: "5px 10px",
          }}
        >
          View the Resource{" "}
          <span
            className="material-icons"
            style={{ fontSize: "12px", marginLeft: "5px" }}
          >
            open_in_new
          </span>
        </button>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            marginTop: "90px",
            padding: "0 120px",
          }}
        >
          <img
            src={material.imageUrl}
            alt="Material"
            style={{
              border: "1px solid #393939",
              boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.3)",
              width: "210px",
              height: "250px",
              marginRight: "40px",
            }}
          />
          <div>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Tensor Sans",
                marginBottom: "20px",
                marginRight: "90px",
              }}
            >
              {material.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Tensor Sans",
                marginBottom: "20px",
              }}
            >
              <strong>Type:</strong> {material.category}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Tensor Sans",
                marginBottom: "20px",
              }}
            >
              <strong>Author: </strong>
              {material.author}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Tensor Sans",
                marginBottom: "20px",
              }}
            >
              <strong>Publication: </strong>
              {material.institution}
            </Typography>

            <Typography
              sx={{
                fontFamily: "Tensor Sans",
                marginBottom: "20px",
              }}
            >
              <strong>Date Published: </strong>
              {formatDate(material.date_published)}
            </Typography>
          </div>
        </div>
        <Typography
          sx={{
            fontFamily: "Tensor Sans",
            marginBottom: "20px",
            marginTop: "20px",
            marginLeft: "120px",
            marginRight: "120px",
          }}
        >
          <strong>Description:</strong> {material.description}
        </Typography>
      </div>
    );
  };

  return (
    <div>
      <h2 className="researchers-title">Search Results</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <TextField
          label="Search by title, author, publication, description, type, and, SDG tag..."
          variant="outlined"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
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
      <div>
        {results.map((result, index) => (
          <Paper
            key={index}
            elevation={3}
            style={{ margin: "10px", padding: "20px" }}
            onClick={(event) => handleMaterialClick(result, event)}
          >
            <Grid item xs={2} style={{ position: "relative" }}>
              <button
                onClick={(event) => {
                  event.stopPropagation(); // Prevent the event from propagating to the Paper component
                  window.open(result.link, "_blank");
                }}
                style={{
                  position: "absolute",

                  right: 30,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  backgroundColor: "#a2cbe7",
                  color: "black",
                  fontSize: "13px",
                  padding: "5px 10px",
                }}
              >
                View the Resource{" "}
                <span
                  className="material-icons"
                  style={{ fontSize: "12px", marginLeft: "5px" }}
                >
                  open_in_new
                </span>
              </button>
            </Grid>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={2}>
                <img
                  src={result.imageUrl}
                  alt="Material"
                  style={{ width: "150px", height: "200px" }}
                />
              </Grid>

              <Grid item xs={8}>
                <Typography variant="h6" style={{ marginBottom: "5px" }}>
                  <strong>{result.title}</strong>
                </Typography>

                <Typography
                  variant="body1"
                  style={{ marginTop: "10px", marginBottom: "5px" }}
                >
                  <strong> Author: </strong>
                  {result.author}
                </Typography>

                <Typography
                  variant="body2"
                  style={{ marginBottom: "5px", marginRight: "-220px" }}
                >
                  <strong> Description: </strong>
                  {result.description}
                </Typography>
              </Grid>
              <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/icon?family=Material+Icons"
              />
            </Grid>
          </Paper>
        ))}
      </div>

      {selectedMaterial && (
        <Modal
          open={Boolean(selectedMaterial)}
          onClose={handleClosePopup}
          BackdropProps={{ style: { backgroundColor: "transparent" } }}
        >
          <MaterialInfoPopup
            material={selectedMaterial}
            onClose={handleClosePopup}
          />
        </Modal>
      )}
    </div>
  );
}

export default SearchPage;
