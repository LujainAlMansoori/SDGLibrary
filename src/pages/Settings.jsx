import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import {
  Button,
  Card,
  CardBody,
  Radio,
  Typography,
  IconButton,
  Input,
} from "@material-tailwind/react";
import InputAdornment from "@mui/material/InputAdornment";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { storage } from "../firebase";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  getMetadata,
} from "firebase/storage";

const Settings = () => {
  const [fileDetails, setFileDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "text/csv") {
        setSelectedFile(file);
        setFileName(file.name);
      } else {
        alert("Only CSV files are allowed.");
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear the file input if wrong file type is selected
        }
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("No file selected for upload");
      return;
    }

    const fileRef = storageRef(storage, "settings/keywords.csv");

    uploadBytes(fileRef, selectedFile)
      .then((snapshot) => {
        console.log("Upload successful");
        Promise.all([getDownloadURL(fileRef), getMetadata(fileRef)])
          .then(([url, metadata]) => {
            setFileDetails({
              name: "keywords.csv",
              url: url,
              updated: metadata.updated,
            });
            setLoading(false);
            setFileName("");
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          })
          .catch((error) => {
            console.error("Error fetching file details", error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error("Upload error:", error);
      });
  };

  useEffect(() => {
    const fileRef = storageRef(storage, "settings/keywords.csv"); // Direct reference to settings.csv

    Promise.all([getDownloadURL(fileRef), getMetadata(fileRef)])
      .then(([url, metadata]) => {
        setFileDetails({
          name: metadata.name,
          url: url,
          updated: metadata.updated,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="px-8">
        <Typography color="blue-gray" className="mb-3 text-left" variant="h4">
          Settings
        </Typography>
        <Typography className="text-[18px] font-normal leading-[30px] text-gray-500">
          This is the file that holds the keywords used for tagging new
          materials added to the platform.
        </Typography>
        {loading ? (
          <p>Loading file details...</p>
        ) : (
          fileDetails && (
            <div>
              <h2>File Details:</h2>
              <p>Name: {fileDetails.name}</p>
              <p>
                URL:{" "}
                <a
                  href={fileDetails.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </p>
              <p>
                Last Updated: {format(new Date(fileDetails.updated), "PPPppp")}
              </p>
            </div>
          )
        )}
        <div className="max-w-screen-md flex flex-col">
          <div className="flex flex-col items-center justify-center space-y-2 p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <Button color="lightBlue" variant="outlined">
              <input
                type="file"
                name="file_upload"
                onChange={handleChange}
                ref={fileInputRef}
                accept=".csv,text/csv"
              />
            </Button>
            <Button
              color="red"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
                setSelectedFile(null);
                setFileName("");
              }}
            >
              Cancel
            </Button>
            <Button color="green" onClick={handleUpload}>
              Upload
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
