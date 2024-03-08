import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

import db, { storage } from "../firebase";
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

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

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
    tags: "",
  });
  const [file, setFile] = useState(null);
  const [inputKey, setInputKey] = useState(Date.now());

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setFile(e.target.files[0]);
      setMaterialDetails({
        ...materialDetails,
        fileName: e.target.files[0] ? e.target.files[0].name : "",
      });
    } else {
      const { name, value } = e.target;
      setMaterialDetails({
        ...materialDetails,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let fileUrl = "";
    let imageUrl = ""; // Variable to store the image URL

    if (file) {
      const fileStorageRef = storageRef(storage, `documents/${file.name}`);
      const uploadResult = await uploadBytes(fileStorageRef, file);
      fileUrl = await getDownloadURL(uploadResult.ref);

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
      documentUrl: fileUrl,
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
        tags: "",
      });
      setFile(null);
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
