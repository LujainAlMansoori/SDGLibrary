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
import Chip from "@mui/material/Chip";
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
import { styled } from "@mui/material/styles";
import "../components/style/ErrorMessages.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

const ListItem = styled("li")(({ theme }) => ({
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
    fileName: "",
  });

  const [isProcessingTags, setIsProcessingTags] = useState(false);

  const [file, setFile] = useState(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const [inputKey, setInputKey] = useState(Date.now());
  const [tagInput, setTagInput] = useState("");
  const keywordsCsvUrl =
    "https://firebasestorage.googleapis.com/v0/b/sdglibrary-dfc2c.appspot.com/o/keywords.csv?alt=media&token=3d65b7b6-31bc-4245-b777-30559570f050";

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
    setIsProcessingTags(true);
    setIsLoadingTags(true); // Start loading
    try {
      const response = await fetch("https://tag-pdf-dmyfoapmsq-uc.a.run.app", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pdfUrl, keywordsCsvUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }

      const tagsData = await response.json();
      const newTags = Object.entries(tagsData).flatMap(([category, keywords]) =>
        keywords.map((keyword) => `${category}: ${keyword}`)
      );

      setMaterialDetails((prevDetails) => ({
        ...prevDetails,
        tags: [...prevDetails.tags, ...newTags],
      }));
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setIsLoadingTags(false); // End loading
      setIsProcessingTags(false);
    }
  };

  const [confirmMessage, setConfirmMessage] = useState({
    text: "",
    show: false,
  });
  const [errorMessage, setErrorMessage] = useState({ text: "", show: false });

  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [linkError, setLinkError] = useState("");

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === "link") {
      const urlPattern =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
      if (value && !urlPattern.test(value)) {
        setLinkError("Add a valid link.");
      } else {
        setLinkError("");
      }
    }

    if (e.target.type === "file") {
      const newFile = e.target.files[0];
      if (newFile) {
        if (newFile.type !== "application/pdf") {
          setErrorMessage({
            text: "Please upload a PDF.",
            show: true,
          });
          setTimeout(() => setErrorMessage({ text: "", show: false }), 5000);
          return;
        }
        // Check if newFile is defined
        setFile(newFile);
        const { name, value } = e.target;

        setMaterialDetails({
          ...materialDetails,
          fileName: newFile.name, // Access name property safely
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
    } else if (e.key === "Enter" && tagInput) {
      e.preventDefault();
      if (!materialDetails.tags.includes(tagInput.trim())) {
        // Prevent duplicate tags
        setMaterialDetails({
          ...materialDetails,
          tags: [...materialDetails.tags, tagInput.trim()],
        });
      }

      setTagInput(""); // Clear input field
    } else {
      const { name, value } = e.target;
      setMaterialDetails({
        ...materialDetails,
        [name]: value,
      });
    }
  };

  const isFormValid = () => {
    const requiredFields = [
      "title",
      "author",
      "category",
      "institution",
      "publisher",
      "date_published",
      "description",
      "link",
      "fileName",
    ];

    if (materialDetails.category === "Journal") {
      requiredFields.push("journalName");
    }

    const fieldsValid = requiredFields.every(
      (field) => materialDetails[field] && materialDetails[field].trim() !== ""
    );

    return fieldsValid && linkError === "";
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
      setConfirmMessage({
        text: "Successfully added the material to the SDGLibrary",
        show: true,
      });
      setTimeout(() => setConfirmMessage({ text: "", show: false }), 5000);
    } catch (error) {
      console.error("Error writing document: ", error);
      setErrorMessage({
        text: "Failed to add material to SDGLibrary.",
        show: true,
      });
      setTimeout(() => setErrorMessage({ text: "", show: false }), 5000);
    } finally {
      setIsProcessingTags(false);
      setIsLoadingTags(true);
    }
  };

  return (
    <div>
      {confirmMessage.show && (
        <div className="confirmMessage">
          <Typography>{confirmMessage.text}</Typography>
        </div>
      )}

      {errorMessage.show && (
        <div className="errorMessage">
          <Typography>{errorMessage.text}</Typography>
        </div>
      )}

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
                {materialDetails.category === "Journal" && (
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
                )}

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
                    error={Boolean(linkError)}
                    helperText={linkError}
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
                    label="Press Enter to Add Tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleChange}
                  />
                  <Paper
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexWrap: "wrap",
                      listStyle: "none",
                      p: 0.5,
                      m: 0,
                    }}
                    component="ul"
                  >
                    {materialDetails.tags.map((tag, index) => (
                      <ListItem key={index}>
                        <Chip label={tag} onDelete={handleDeleteTag(tag)} />
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
                    disabled={
                      !isFormValid() || isLoadingTags || isProcessingTags
                    }
                  >
                    {isProcessingTags ? "Processing tags..." : "Submit"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Paper>
    </div>
  );
}
