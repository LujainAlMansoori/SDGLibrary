import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
// import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

import db, { storage } from "../firebase";
import Chip from '@mui/material/Chip';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from '@mui/material/styles';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function NewMaterial() {
  const [materialDetails, setMaterialDetails] = useState({
    title: "",
    author: "",
    date_published: "",
    description: "",
    link: "",
    category: "",
    publisher: "",
    journalName: "",
    institution: "",
    tags: [],
  });
  const [file, setFile] = useState(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const [inputKey, setInputKey] = useState(Date.now());
  const [tagInput, setTagInput] = useState("");
  const keywordsCsvUrl = "https://firebasestorage.googleapis.com/v0/b/sdglibrary-dfc2c.appspot.com/o/keywords.csv?alt=media&token=3d65b7b6-31bc-4245-b777-30559570f050"

  useEffect(() => {
    console.log("Document URL changed:", documentUrl);
    if (documentUrl) {
      fetchAndSetTags(documentUrl, keywordsCsvUrl);
    }
  }, [documentUrl]);

  useEffect(() => {
    console.log("Material Details", materialDetails);
  }, [materialDetails]);

  const handleDeleteTag = (tagToDelete) => () => {
    setMaterialDetails({
      ...materialDetails,
      tags: materialDetails.tags.filter((tag) => tag !== tagToDelete),
    });
  };

  // Function that calls the tag_pdf Cloud Function and updates the state with tags
  const fetchAndSetTags = async (pdfUrl, keywordsCsvUrl) => {
    try {
      const response = await fetch('https://tag-pdf-dmyfoapmsq-uc.a.run.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pdfUrl, keywordsCsvUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tags');
      }

      const tagsData = await response.json();
      const newTags = Object.entries(tagsData).flatMap(([category, keywords]) =>
        keywords.map(keyword => `${category}: ${keyword}`));

      setMaterialDetails(prevDetails => ({
        ...prevDetails,
        tags: [...prevDetails.tags, ...newTags],
      }));
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleChange = async (e) => {
    if (e.target.type === "file") {
      const newFile = e.target.files[0];
      setFile(newFile);
      setMaterialDetails({
        ...materialDetails,
        fileName: newFile ? newFile.name : "",
      });

      // file upload
      const fileStorageRef = storageRef(storage, `documents/${newFile.name}`);
      try {
        const uploadResult = await uploadBytes(fileStorageRef, newFile);
        const newDocumentUrl = await getDownloadURL(uploadResult.ref);
        console.log("New file URL:", newDocumentUrl);
        setDocumentUrl(newDocumentUrl);
      } catch (error) {
        console.error("Error uploading file: ", error);
      }
    }
    else if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      if (!materialDetails.tags.includes(tagInput.trim())) { // Prevent duplicate tags
        setMaterialDetails({
          ...materialDetails,
          tags: [...materialDetails.tags, tagInput.trim()],
        });
      }
      setTagInput(""); // Clear input field
    }
    else {
      const { name, value } = e.target;
      setMaterialDetails({
        ...materialDetails,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = ""; // Variable to store the image URL

    if (file) {
      // Convert the first page of the PDF to an image
      const pdfBytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
      const firstPage = await pdf.getPage(1);
      const viewport = firstPage.getViewport({ scale: 1 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await firstPage.render({ canvasContext: context, viewport: viewport })
        .promise;

      // Upload the image to Firebase
      const imageBlob = await new Promise((resolve) => canvas.toBlob(resolve));
      const imageRef = storageRef(
        storage,
        `documentImages/${file.name}_page_1.png`
      );
      const imageUploadResult = await uploadBytes(imageRef, imageBlob);
      imageUrl = await getDownloadURL(imageUploadResult.ref);
    }

    const finalMaterialDetails = {
      ...materialDetails,
      documentUrl: documentUrl,
      imageUrl: imageUrl, // Add the image URL to the material details
    };

    try {
      await addDoc(collection(db, "materials"), finalMaterialDetails);
      console.log("Document successfully written!");
      setMaterialDetails({
        title: "",
        author: "",
        date_published: "",
        description: "",
        link: "",
        category: "",
        publisher: "",
        journalName: "",
        institution: "",
        tags: [],
      });
      setFile(null);
      setDocumentUrl("");
      setInputKey(Date.now());
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        mt: 7,
        backgroundColor: "white",
        width: 700,
        marginLeft: "23%",
        mb: 4,
        padding: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            New Material
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="title"
                  label="Title"
                  value={materialDetails.title}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="author"
                  label="Author"
                  value={materialDetails.author}
                  onChange={handleChange}
                />
              </Grid>

              {/* Category field */}
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={materialDetails.category}
                    label="Category"
                    onChange={handleChange}
                  >
                    <MenuItem value="Journal">Journal</MenuItem>
                    <MenuItem value="Research Paper">Research Paper</MenuItem>
                    <MenuItem value="Lesson Plan">Lesson Plan</MenuItem>
                    <MenuItem value="Annual Report">Annual Report</MenuItem>
                    <MenuItem value="Academic Writing">
                      Academic Writing
                    </MenuItem>
                    <MenuItem value="Report">Report</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* Institution field */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="institution"
                  label="Institution"
                  value={materialDetails.institution}
                  onChange={handleChange}
                />
              </Grid>

              {/* Publisher field */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="publisher"
                  label="Publisher"
                  value={materialDetails.publisher}
                  onChange={handleChange}
                />
              </Grid>
              {/* Journal Name field */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="journalName"
                  label="Journal Name"
                  value={materialDetails.journalName}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="date_published"
                  label="Date Published"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={materialDetails.date_published}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                  label="Description"
                  value={materialDetails.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="link"
                  label="Link"
                  value={materialDetails.link}
                  onChange={handleChange}
                />
              </Grid>
              {/* Upload File field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="text"
                  value={materialDetails.fileName || "Upload File"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton color="primary" component="label">
                          <CloudUploadIcon />
                          <input
                            type="file"
                            name="file_upload"
                            hidden
                            onChange={handleChange}
                            key={inputKey}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleChange}
                  helperText="Press enter to add tags"
                />
                <Paper
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0.5,
                    m: 0,
                  }}
                  component="ul"
                >
                  {materialDetails.tags.map((tag, index) => (
                    <ListItem key={index}>
                      <Chip
                        label={tag}
                        onDelete={handleDeleteTag(tag)}
                      />
                    </ListItem>
                  ))}
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
}
