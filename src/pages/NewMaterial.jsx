import React, { useState, useEffect } from "react";

import {
  // Button,
  Card,
  Checkbox,
  // Container,
  IconButton,
  Input,
  Select,
  Option,
  Textarea,
  Typography,
} from "@material-tailwind/react";
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
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
import InputAdornment from "@mui/material/InputAdornment";
// import IconButton from "@mui/material/IconButton";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import "../components/style/ErrorMessages.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const sdglist = [
  "SDG1 - No Poverty",
  "SDG2 - Zero Hunger",
  "SDG3 - Good Health and Well-being",
  "SDG4 - Quality Education",
  "SDG5 - Gender Equality",
  "SDG6 - Clean Water and Sanitation",
  "SDG7 - Affordable and Clean Energy",
  "SDG8 - Decent Work and Economic Growth",
  "SDG9 - Industry, Innovation, and Infrastructure",
  "SDG10 - Reduced Inequality",
  "SDG11 - Sustainable Cities and Communities",
  "SDG12 - Responsible Consumption and Production",
  "SDG13 - Climate Action",
  "SDG14 - Life Below Water",
  "SDG15 - Life on Land",
  "SDG16 - Peace and Justice Strong Institutions",
  "SDG17 - Partnerships to achieve the Goal",
];

function NewMaterial() {
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
  const [keywordsCsvUrl, setKeywordsCsvUrl] = useState("");

  useEffect(() => {
    const fetchKeywordsCsvUrl = async () => {
      const settingsRef = storageRef(storage, "settings/keywords.csv");
      try {
        const url = await getDownloadURL(settingsRef);
        setKeywordsCsvUrl(url);
      } catch (error) {
        console.error("Error fetching keywords.csv URL:", error);
        setKeywordsCsvUrl("");
      }
    };

    fetchKeywordsCsvUrl();
  }, []);

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

  const sdgMapping = sdglist.reduce((acc, item) => {
    const [code, description] = item.split(" - ");
    acc[code.replace("SDG", "SDG ").trim()] = item; // Ensure format like "SDG 1" matches "SDG1"
    return acc;
  }, {});
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
      const newTags = [];

      Object.entries(tagsData).forEach(([category, keywords]) => {
        const fullCategoryName = sdgMapping[category]; // Map to full name
        if (fullCategoryName) {
          newTags.push(fullCategoryName); // Add the full SDG name
          keywords.forEach((keyword) => {
            newTags.push(keyword); // Add each keyword under the SDG
          });
        }
      });

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
        // const { name, value } = e.target;

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
    } else if (name === "tags") {
      //do nothing
    } else {
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
      <Typography
        variant="h1"
        color="blue-gray"
        className="mb-4 !text-3xl lg:!text-5xl"
      >
        Add New Material
      </Typography>
      <form onSubmit={handleSubmit}>
        <Container className="mx-auto space-y-4">
          <Input
            label="Title"
            name="title"
            required
            value={materialDetails.title}
            onChange={handleChange}
          />

          <Select
            required
            label="Category"
            name="category"
            value={materialDetails.category}
            onChange={(val) =>
              setMaterialDetails({
                ...materialDetails,
                category: val,
              })
            }
          >
            <Option value="Journal">Journal</Option>
            <Option value="Research Paper">Research Paper</Option>
            <Option value="Lesson Plan">Lesson Plan</Option>
            <Option value="Annual Report">Annual Report</Option>
            <Option value="Academic Writing">Academic Writing</Option>
            <Option value="Report">Report</Option>
          </Select>

          <Input
            label="Author"
            name="author"
            required
            value={materialDetails.author}
            onChange={handleChange}
          />
          <Input
            label="Institution"
            name="institution"
            required
            value={materialDetails.institution}
            onChange={handleChange}
          />
          <Input
            label="Publisher"
            name="publisher"
            required
            value={materialDetails.publisher}
            onChange={handleChange}
          />

          {materialDetails.category === "Journal" && (
            <Input
              label="Journal Name"
              name="journalName"
              required
              value={materialDetails.journalName}
              onChange={handleChange}
            />
          )}

          <Input
            type="date"
            label="Date Published"
            name="date_published"
            required
            value={materialDetails.date_published}
            onChange={handleChange}
          />
          <Textarea
            label="Description"
            name="description"
            required
            value={materialDetails.description}
            onChange={handleChange}
            rows={4}
          />
          <Input
            label="Link"
            name="link"
            required
            error={Boolean(linkError)}
            helperText={linkError}
            value={materialDetails.link}
            onChange={handleChange}
          />
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

          <Grid item xs={12}>
            <TextField
              fullWidth
              name="tags"
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
          <Button
            type="submit"
            variant="gradient"
            color="lightBlue"
            disabled={!isFormValid() || isLoadingTags || isProcessingTags}
          >
            {isProcessingTags ? "Processing tags..." : "Submit"}
          </Button>
        </Container>
      </form>
    </div>
  );
}

export default NewMaterial;
