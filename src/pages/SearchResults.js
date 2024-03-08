// SearchResults.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchResults() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="researchers-title">Materials</p>
      <TextField
        label="Search..."
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        style={{ margin: "10px 10px", marginLeft: "40px", width: 1250 }}
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleSearch}>
              <SearchIcon />
            </IconButton>
          ),
        }}
      />
    </div>
  );
}
