import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
import { sendEmailVerification, onAuthStateChanged } from "firebase/auth";

export default function SignUp() {
  const [errorMessage, setErrorMessage] = useState({ text: "", show: false });
  const [confirmMessage, setConfirmMessage] = useState({
    text: "",
    show: false,
  });

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
            success: `Successfully logged in.`,
          },
        });
      }
    } catch (error) {
      setErrorMessage({
        text: "Failed to sign in.",
        show: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Check if the user is already signed in
      if (auth.currentUser) {
        // Sign out the current user
        await auth.signOut();
      }

      // Create a new user account
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

      // Send a verification email if the email is not verified
      if (!user.emailVerified) {
        await sendEmailVerification(user);
        setConfirmMessage({
          text: "Please check your email to verify your account.",
          show: true,
        });
      } else {
        // If the email is verified, proceed to check if a profile exists for the user
        checkUserProfile(user);
      }
    } catch (error) {
      // If there's an error (e.g., user already exists), try signing in instead
      try {
        const signInUser = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = signInUser.user;
        if (user.emailVerified) {
          // If the user's email is verified, proceed to check their profile
          checkUserProfile(user);
        } else {
          setErrorMessage({
            text: "Please verify your email before signing in.",
            show: true,
          });
        }
      } catch (signInError) {
        setErrorMessage({
          text: "Failed to sign in. Please check your credentials.",
          show: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const checkUserProfile = async (user) => {
    const userProfileRef = doc(db, "profiles", user.uid);
    const userProfileSnap = await getDoc(userProfileRef);

    if (!userProfileSnap.exists()) {
      const userProfileData = {
        email: user.email,
        accountRole: "member",
      };
      await setDoc(userProfileRef, userProfileData);

      // Log the user's role
      console.log("User profile created:", userProfileData, user.accountRole);

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
  };

  return (
    <div>
      {errorMessage.show && (
        <div className="errorMessage">
          <Typography>{errorMessage.text}</Typography>
        </div>
      )}

      {confirmMessage.show && (
        <div className="confirmMessage">
          <Typography>{confirmMessage.text}</Typography>
        </div>
      )}

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
                Sign In
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
                  Sign In
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
                Sign In with Google
              </Button>
            </Box>
          </Container>
        </Paper>
      </div>
    </div>
  );
}
