import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { app } from "../firebase.js";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import { Link, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import "../components/style/ErrorMessages.css";

export default function SignUp() {
  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        navigate("/", {
          state: {
            success: `Successfully logged in.`,
          },
        });
      } else {
        // await setDoc(userProfileRef, {
        //   email: user.email, // Save the email from the authenticated user object
        // }, { merge: true });
        // No profile found, navigate to profile creation page
        navigate("/createProfile", {
          state: {
            success: `Your account has been successfully created.`,
          },
        });
      }
    } catch (error) {
      console.error("Failed to sign in with Google:", error);
      setError("Failed to sign in with Google: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

      //Check if the user already exists
      const userProfileRef = doc(db, "profiles", user.uid);
      const userProfileSnap = await getDoc(userProfileRef);

      if (!userProfileSnap.exists()) {
        // no profile so we create a new one
        await setDoc(userProfileRef, {
          email: user.email,
        });
        // No profile found, navigate to profile creation page
        navigate("/createProfile", {
          state: {
            success: `Your account has been successfully created.`,
          },
        });
      } else {
        // User exists, navigate to home page
        navigate("/", {
          state: {
            success: `Successfully logged in.`,
          },
        });
      }
    } catch (error) {
      console.error("Failed to sign up with email and password:", error);
      setError("Failed to sign up with email and password: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
              Sign Up
            </Typography>
            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {error}
              </Alert>
            )}
            <form onSubmit={handleEmailSignUp}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                Sign Up
              </Button>
            </form>

            <Typography component="h1" variant="h5">
              or
            </Typography>

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
              Sign Up with Google
            </Button>
          </Box>
        </Container>
      </Paper>
    </div>
  );
}
