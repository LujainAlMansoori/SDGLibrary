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
          top: "8.5vh", // Adjust the top position based on viewport height
          right: "0", // Adjust the right position based on viewport width
          bottom: "0", // Adjust the bottom position based on viewport height
          zIndex: 2,
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
            width: "1.5vw",
            height: "1.5vw",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            backgroundColor: "#f0f0f0",
            color: "black",
            fontSize: "0.5vw",
            marginTop: "2vw",
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
            right: "4vw",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            backgroundColor: "#a2cbe7",
            color: "black",
            fontSize: "0.8vw",

            marginTop: "2vw",
            padding: "0.5vw 0.8vw",
          }}
        >
          View the Resource{" "}
          <span
            className="material-icons"
            style={{ fontSize: "1vw", marginLeft: "5px" }}
          >
            open_in_new
          </span>
        </button>
        <div style={{ marginTop: "9vw", padding: "0 7vw" }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Tensor Sans",
              marginBottom: "3vw",
              fontSize: "2vw",
              color: "#153363",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <strong>{material.title}</strong>
          </Typography>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div>
              {/* Metadata Typography components for Type, Author, Publication, Date Published */}
              <Typography
                sx={{
                  fontFamily: "Tensor Sans",
                  marginBottom: "20px",
                  fontSize: "1.2vw",
                }}
              >
                <strong>Type:</strong> {material.category}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Tensor Sans",
                  marginBottom: "20px",
                  fontSize: "1.2vw",
                }}
              >
                <strong>Author: </strong>
                {material.author}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Tensor Sans",
                  marginBottom: "20px",
                  fontSize: "1.2vw",
                }}
              >
                <strong>Publication: </strong>
                {material.institution}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Tensor Sans",
                  marginBottom: "20px",
                  fontSize: "1.2vw",
                }}
              >
                <strong>Date Published: </strong>
                {formatDate(material.date_published)}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Tensor Sans",
                  marginBottom: "20px",
                  marginTop: "20px",
                  fontSize: "1.2vw",
                  marginRight: "1vw",
                }}
              >
                <strong>Description:</strong> {material.description}
              </Typography>
            </div>
            <img
              src={material.imageUrl}
              alt="Material"
              style={{
                boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.3)",
                width: "20vw",
                height: "23vw",
                marginLeft: "2%",
                marginRight: "-6%",
              }}
            />
          </div>
        </div>
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
            width: "70vw",
            marginTop: "-2%",
            marginBottom: "3%",
          }}
          InputLabelProps={{
            style: {
              fontSize: "calc(0.2rem + 1vw)",
              top: "5%",

              background: "#fff",
              marginLeft: "0.5%",
              marginBottom: "1%",
              padding: "0vw 5vh",
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "25vw",
              height: "4vw",
              padding: "0 14px",
            },
            "& .MuiInputBase-input": {
              fontSize: "calc(0.4rem + 1vw)",
              marginLeft: "2%",
              overflow: "hidden", // Prevents text from overflowing
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  sx={{
                    maxWidth: "100%", // Ensure the icon respects the boundaries of its container
                  }}
                  onClick={handleSearch}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div>
        {/* Display message if no results found */}
        {searchQuery && results.length === 0 && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <Typography
              variant="body1"
              style={{ marginLeft: "30px", marginTop: "20px", color: "black" }}
            >
              No material with this research result.
            </Typography>
          </div>
        )}
        {results.map((result, index) => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Paper
              key={index}
              elevation={3}
              style={{
                margin: "0.7%",
                padding: "2%",
                width: "90vw",
                height: "auto",
                minHeight: "30vh",
              }}
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
                    fontSize: "1vw",
                    boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.3)",
                    padding: "0.5vw 0.8vw",
                  }}
                >
                  View the Resource{" "}
                  <span
                    className="material-icons"
                    style={{ fontSize: "1vw", marginLeft: "5px" }}
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
                    style={{
                      width: "13vw",
                      height: "17vw",

                      boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                </Grid>

                <Grid item xs={8}>
                  <Typography
                    variant="h6"
                    style={{
                      marginBottom: "5px",
                      fontSize: "1.6vw",
                      color: "#153363",
                    }}
                  >
                    <strong>{result.title}</strong>
                  </Typography>

                  <Typography
                    variant="body1"
                    style={{
                      marginTop: "10px",
                      marginBottom: "5px",
                      fontSize: "1.2vw",
                    }}
                  >
                    <strong> Author: </strong>
                    {result.author}
                  </Typography>

                  <Typography
                    variant="body2"
                    style={{
                      marginBottom: "5px",
                      marginRight: "-15vw",
                      fontSize: "1.1vw",
                    }}
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
          </div>
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
