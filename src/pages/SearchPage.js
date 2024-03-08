import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("query");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery) {
        const materialsRef = collection(db, "materials");
        const querySnapshot = await getDocs(materialsRef);
        const allResults = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("All Results:", allResults); // Print all results
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
              material.author
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            material.publisher.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });
        console.log("Filtered Results:", filteredResults);
        setResults(filteredResults);
      }
    };

    fetchResults();
  }, [searchQuery]);

  return (
    <div>
      <h2>Search Results for: {searchQuery}</h2>
      {results.map((result, index) => (
        <Paper
          key={index}
          elevation={3}
          style={{ margin: "10px", padding: "20px" }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={2}>
              <img
                src={result.imageUrl}
                alt="Material"
                style={{ width: "100px", height: "100px" }}
              />
            </Grid>

            <Grid item xs={10}>
              <p style={{ margin: 0 }}>{result.title}</p>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </div>
  );
}

export default SearchPage;
