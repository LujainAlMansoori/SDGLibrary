import React, { useEffect, useState, useRef } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContexts";
import { db } from "../firebase";
import { useUserProfile } from "../contexts/UserProfileContexts.js";
import {
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import {
  uploadBytes,
  getDownloadURL,
  ref as storageRef,
  getStorage,
} from "firebase/storage";

import {
  InputLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

export default function EditProfile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const profileImageInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  

  const [initialProfile, setInitialProfile] = useState(null);

  const [confirmMessage, setConfirmMessage] = useState({
    text: "",
    show: false,
  });
  const [errorMessage, setErrorMessage] = useState({
    text: "",
    show: false,
  });

  const handleSDGChange = (event, sdg) => {
    if (event.target.checked) {
      setProfile({
        ...profile,
        researchInterests: [...profile.researchInterests, sdg],
      });
    } else {
      setProfile({
        ...profile,
        researchInterests: profile.researchInterests.filter(
          (interest) => interest !== sdg
        ),
      });
    }
  };

  const sdgList = [
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
  useEffect(() => {
    async function fetchProfileOfCurrentUser() {
      if (currentUser) {
        const profileDoc = await getDoc(doc(db, "profiles", currentUser.uid));
        if (profileDoc.exists()) {
          const data = profileDoc.data();
          setProfile(data);
          setInitialProfile(data); // Set initial profile data
          setProfileImage(data.profileImage);
        } else {
          console.log("No such profile for current user!");
        }
      }
    }

    fetchProfileOfCurrentUser();
  }, [currentUser]);

  const hasProfileChanged = () => {
    if (!initialProfile || !profile) return false;

    return (
      initialProfile.title !== profile.title ||
      initialProfile.firstName !== profile.firstName ||
      initialProfile.lastName !== profile.lastName ||
      initialProfile.role !== profile.role ||
      initialProfile.linkedin !== profile.linkedin ||
      initialProfile.biography !== profile.biography ||
      initialProfile.currentProjects !== profile.currentProjects ||
      JSON.stringify(initialProfile.researchInterests) !==
        JSON.stringify(profile.researchInterests) ||
      profileImage !== initialProfile.profileImage
    );
  };

  const handleProfileImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setProfileImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleProfileImageClick = () => {
    profileImageInputRef.current.click();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    let profileImageUrl = profile.profileImage;

    if (profileImageInputRef.current.files[0]) {
      const imageFile = profileImageInputRef.current.files[0];
      const imageRef = storageRef(
        getStorage(),
        `profileImages/${currentUser.uid}/${imageFile.name}`
      );
      const uploadResult = await uploadBytes(imageRef, imageFile);
      profileImageUrl = await getDownloadURL(uploadResult.ref);
    }

    const updatedProfile = {
      ...profile,
      profileImage: profileImageUrl,
    };

    try {
      await updateDoc(doc(db, "profiles", currentUser.uid), updatedProfile);
      setConfirmMessage({
        text: "Profile updated successfully",
        show: true,
      });
      setTimeout(() => setConfirmMessage({ text: "", show: false }), 5000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage({
        text: "Error updating profile",
        show: true,
      });
      setTimeout(() => setErrorMessage({ text: "", show: false }), 5000);
    }

    setLoading(false);
  };

  return (
    <Container component="main" maxWidth="sm">
      {profile ? (
        <Paper elevation={4} sx={{ p: 4, mt: 4 }}>
          <Typography component="h1" variant="h5">
            Edit Profile
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
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
                        labelId="title-select-label"
                        id="title-select"
                        name="title"
                        value={profile.title}
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
                        {profile.title && (
                          <MenuItem value={profile.title}>
                            {profile.title}
                          </MenuItem>
                        )}
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
                      value={profile.firstName}
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
                      value={profile.lastName}
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
                      value={profile.role}
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
                  name="linkedin"
                  fullWidth
                  label="LinkedIn URL"
                  value={profile.linkedin}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="biography"
                  fullWidth
                  label="Biography"
                  multiline
                  rows={4}
                  value={profile.biography}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="currentProjects"
                  fullWidth
                  label="Current Projects"
                  multiline
                  rows={4}
                  value={profile.currentProjects}
                  onChange={handleChange}
                />
              </Grid>
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
                    {sdgList.map((sdg) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={profile.researchInterests.includes(sdg)}
                            onChange={(event) => handleSDGChange(event, sdg)}
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

              {/* <Grid item xs={12}>
              <input
                accept="image/*"
                type="file"
                ref={profileImageInputRef}
                onChange={handleProfileImageChange}
                style={{ display: "none" }}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                onClick={handleProfileImageClick}
              >
                <PhotoCamera />
              </IconButton>
              {profileImage && (
                <Avatar
                  src={profileImage}
                  sx={{ width: 100, height: 100, mt: 2 }}
                />
              )}
            </Grid> */}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || !hasProfileChanged()}
            >
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </Box>
        </Paper>
      ) : (
        <Typography></Typography>
      )}
    </Container>
  );
}
