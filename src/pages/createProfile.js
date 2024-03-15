import React, { useRef, useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { Link, useNavigate, useLocation } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

import {
  uploadBytes,
  getDownloadURL,
  getStorage,
  ref as storageRef,
} from "firebase/storage";

import { ref, uploadBytesResumable } from "../firebase";

// getting user input and sending it to the DB
import { db } from "../firebase"; // Adjust the path as necessary
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContexts";

export default function CreateProfile() {
  const location = useLocation();
  const [formValues, setFormValues] = useState({
   
    title: "",
    firstName: "",
    lastName: "",
    role: "",
    linkedinName: "",
    linkedin: "",
    biography: "",
    currentProjects: "",
  });

  const [linkError, setLinkError] = useState("");

  const [confirmMessage, setConfirmMessage] = useState({
    text: "",
    show: false,
  });
  const [errorMessage, setErrorMessage] = useState({ text: "", show: false });
  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "linkedin") {
      const urlPattern =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
      if (value && !urlPattern.test(value)) {
        setLinkError("Add a valid link.");
      } else {
        setLinkError("");
      }
    }

    setFormValues({ ...formValues, [name]: value });
  };

  const isFormValid = () => {
    return (
      Object.values(formValues).every((value) => value.trim() !== "") &&
      selectedSDGs.length > 0 &&
      linkError === ""
    );
  };

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (location.state?.success) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000); // 5000 milliseconds = 5 seconds

      return () => clearTimeout(timer); // Clean up the timer when the component unmounts
    }
  }, [location.state?.success]);

  const { currentUser } = useAuth(); // Get the current user from the AuthContext
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // State for the SDG list
  const [selectedSDGs, setSelectedSDGs] = useState([]);
  const [profileImage, setProfileImage] = useState(null); // State for the profile image
  const profileImageInputRef = useRef(null); // Ref for the file input
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
  // Handles profile photo settig it
  const handleProfileImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setProfileImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  // handles when a user clicks on the profile photo
  const handleProfileImageClick = () => {
    profileImageInputRef.current.click();
  };

  // This gets the user's SDGs
  const handleSDGChange = (event) => {
    if (event.target.checked) {
      setSelectedSDGs([...selectedSDGs, event.target.value]);
    } else {
      setSelectedSDGs(selectedSDGs.filter((sdg) => sdg !== event.target.value));
    }
  };
  async function handleSubmit(event) {
    event.preventDefault();
    // Profile image  URL
    let profileImageUrl = "";
    // Validation checks
    //  if (PasswordRef.current.value !== ConfirmPasswordRef.current.value) {
    //  return setError("Passwords Do Not Match.");
    //  }

    // Editing the user's information to include fields from create profile
    if (!currentUser) {
      // If there is no current user, return early
      console.error("No user is logged in");
      return;
    }

    if (profileImageInputRef.current.files[0]) {
      const imageFile = profileImageInputRef.current.files[0];
      const imageRef = storageRef(
        getStorage(),
        `profileImages/${currentUser.uid}/${imageFile.name}`
      );
      const uploadResult = await uploadBytes(imageRef, imageFile);
      profileImageUrl = await getDownloadURL(uploadResult.ref);
    }

    const userProfile = {
      title: event.target.title.value,
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      role: event.target.role.value,
      biography: event.target.biography.value,
      linkedinName: event.target.linkedinName.value,
      linkedin: event.target.linkedin.value,
      currentProjects: event.target.currentProjects.value,
      researchInterests: selectedSDGs,
      profileImage: profileImageUrl,
      email: currentUser.email,
      accountRole: 'member'
    };

    try {
      // TODO: error message
      setError("");
      setLoading(true);
      // Set the document in the 'profiles' collection with the user's UID as the document ID
      await setDoc(doc(db, "profiles", currentUser.uid), userProfile);
      navigate("/researchers");
      setConfirmMessage({
        text: "Successfully created profile.",
        show: true,
      });
      setTimeout(() => setConfirmMessage({ text: "", show: false }), 5000);
    } catch (error) {
      console.error("Error writing document: ", error);
      setErrorMessage({
        text: "Failed to create profile.",
        show: true,
      });
      setTimeout(() => setErrorMessage({ text: "", show: false }), 5000);
    }
    setLoading(false);
  }

  return (
    <div>
      {showSuccessMessage && (
        <div className="confirmMessage">
          <Typography>{location.state.success}</Typography>
        </div>
      )}

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
          height: 830,
          padding: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container
          component="main"
          maxWidth="sm"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              component="h1"
              variant="h4"
              sx={{ fontFamily: "Tenor Sans" }}
            >
              Create Your Profile
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 4 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <FormControl fullWidth required>
                        <InputLabel id="demo-simple-select-label">
                          Title
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          name="title"
                          value={formValues.title}
                          label="Title"
                          onChange={handleChange}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: "black",
                              },
                            },
                          }}
                        >
                          <MenuItem value={"Ms."}>Ms.</MenuItem>
                          <MenuItem value={"Mr."}>Mr.</MenuItem>
                          <MenuItem value={"Dr."}>Dr.</MenuItem>
                          <MenuItem value={"Prof."}>Prof.</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4.5}>
                      <TextField
                        required
                        fullWidth
                        name="firstName"
                        value={formValues.firstName}
                        onChange={handleChange}
                        label="First Name"
                        autoComplete="given-name"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "black",
                            },
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={4.5}>
                      <TextField
                        required
                        fullWidth
                        name="lastName"
                        label="Last Name"
                        value={formValues.lastName}
                        onChange={handleChange}
                        autoComplete="family-name"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "black",
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="role"
                        label="Role"
                        value={formValues.role}
                        onChange={handleChange}
                        autoComplete="role"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&.Mui-focused fieldset": {
                              borderColor: "black",
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Profile Image */}
                <Grid item xs={3}>
                  <Avatar
                    alt="Profile Image"
                    src={profileImage || "../assets/profile-photo.webp"}
                    sx={{
                      width: 120,
                      height: 120,
                      border: "1px solid #838181",
                      boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.2)",
                      cursor: "pointer",
                      "& img": {
                        objectFit: "fit",
                      },
                    }}
                    onClick={handleProfileImageClick}
                  >
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <PhotoCamera />
                    </IconButton>
                  </Avatar>
                  <input
                    type="file"
                    ref={profileImageInputRef}
                    onChange={handleProfileImageChange}
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="linkedinName"
                    label="LinkedIn Username"
                    value={formValues.likedinName}
                    onChange={handleChange}
                    multiline
                    rows={1}
                    autoComplete="linkedinName"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "black",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="linkedin"
                    label="Link to LinkedIn"
                    value={formValues.linkedin}
                    onChange={handleChange}
                    multiline
                    rows={1}
                    error={Boolean(linkError)}
                    helperText={linkError}
                    autoComplete="linkedin"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "black",
                        },
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="biography"
                    label="Biography"
                    value={formValues.biography}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    autoComplete="biography"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "black",
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Current Projects Field */}
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    name="currentProjects"
                    label="Current Projects"
                    value={formValues.currentProjects}
                    onChange={handleChange}
                    autoComplete="current-projects"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "black",
                        },
                      },
                    }}
                  />
                </Grid>

                {/* SDGs Checklist */}
                <Grid item xs={12}>
                  <InputLabel sx={{ my: 2 }}>Research Interests</InputLabel>

                  <Paper
                    elevation={2}
                    sx={{
                      padding: 2,
                      maxHeight: 130,
                      borderStyle: "solid",
                      borderColor: "#D0D0D0",
                      maxWidth: 1030,
                      overflowY: "auto",
                      mt: 1,
                      mb: 1,
                      "&:hover": {
                        borderColor: "black", // Changes border to black on hover
                      },
                    }}
                  >
                    <FormGroup>
                      {sdglist.map((sdg) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedSDGs.includes(sdg)}
                              onChange={handleSDGChange}
                              value={sdg}
                            />
                          }
                          label={sdg}
                          key={sdg}
                        />
                      ))}
                    </FormGroup>
                  </Paper>
                </Grid>

                <Grid item xs={12}></Grid>
              </Grid>
              <Grid container justifyContent="center" sx={{ mt: 3, mb: 2 }}>
                <Button
                  disabled={!isFormValid()}
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, width: 400 }}
                >
                  Create
                </Button>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Paper>
    </div>
  );
}
