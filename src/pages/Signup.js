import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { app } from "../firebase.js";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { Link, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";

export default function SignUp() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth(app); // Use the Firebase app instance
  const db = getFirestore(app); // Initialize Firestore using your Firebase app

  const handleGoogleSignUp = async () => {
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user's profile exists in Firestore in the 'profiles' collection
      const userProfileRef = doc(db, "profiles", user.uid);
      const userProfileSnap = await getDoc(userProfileRef);

      if (userProfileSnap.exists()) {
        // User's profile exists, navigate to home page
        navigate("/");
      } else {
        // await setDoc(userProfileRef, {
        //   email: user.email, // Save the email from the authenticated user object
        // }, { merge: true });
        // No profile found, navigate to profile creation page
        navigate("/createProfile");
      }
    } catch (error) {
      console.error("Failed to sign in with Google:", error);
      setError("Failed to sign in with Google: " + error.message);
    } finally {
      setLoading(false);
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
        height: "auto",
        padding: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            disabled={loading}
            onClick={handleGoogleSignUp}
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              position: "relative", 
            }}
            startIcon={
              <span
                style={{
                  display: "inline-flex", 
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%", 
                  backgroundColor: "white", 
                  width: "30px",
                  height: "30px",
                  marginRight: "8px", 
                }}
              >
                <FcGoogle size={22} style={{ zIndex: 1 }} />
              </span>
            }
          >
            Sign In with Google
          </Button>
        </Box>
      </Container>
    </Paper>
  );
}
