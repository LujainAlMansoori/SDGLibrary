import React, { useRef, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { Link, useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
// getting user input and sending it to the DB
import { db } from "../firebase"; // Adjust the path as necessary
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContexts";


export default function CreateProfile() {
  const { currentUser } = useAuth(); // Get the current user from the AuthContext
  const [selectedSDGs, setSelectedSDGs] = useState([]);
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

      const userProfile = {
        title: event.target.title.value, 
        firstName: event.target.firstName.value,
        lastName: event.target.lastName.value,
        role: event.target.role.value,
        biography: event.target.biography.value,
        currentProjects: event.target.currentProjects.value,
        researchInterests: selectedSDGs,
      };

      try {
        // TODO: error message
   
        // Set the document in the 'profiles' collection with the user's UID as the document ID
        await setDoc(doc(db, "profiles", currentUser.uid), userProfile);
        console.log("Profile created successfully");
      } catch (error) {
        console.error("Error creating profile:", error);
      }
    }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Create Profile
        </Typography>

        {/* {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )} */}

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <FormControl fullWidth required>
                <InputLabel id="demo-simple-select-label">Title</InputLabel>

                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name="title"
                  label="Title"
                  //   onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "black", // Border color when the TextField is focused
                      },
                    },
                  }}
                >
                  <MenuItem value={"Ms."}>Ms.</MenuItem>
                  <MenuItem value={"Mr."}>Mr.</MenuItem>
                  <MenuItem value={"Dr"}>Dr.</MenuItem>
                  <MenuItem value={"Ms."}>Prof.</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4.5}>
              <TextField
                required
                fullWidth
                name="firstName"
                label="First Name"
                autoComplete="given-name"
                // inputRef={FirstNameRef}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "black", // Border color when the TextField is focused
                    },
                  },
                }}
              />
            </Grid>

            {/* Last Name Field */}
            <Grid item xs={4.5}>
              <TextField
                required
                fullWidth
                name="lastName"
                label="Last Name"
                autoComplete="family-name"
                // inputRef={LastNameRef}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "black", // Border color when the TextField is focused
                    },
                  },
                }}
              />
            </Grid>

            {/* Role Field */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="role"
                label="Role"
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

            {/* Biography Field */}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="biography"
                label="Biography"
                multiline
                rows={4} // Adjust the number of rows as needed
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
              // disabled={loading}
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
  );
}
