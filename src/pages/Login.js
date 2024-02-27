import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import Alert from "@mui/material/Alert";
import { Link, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";

export default function Login() {
  const EmailRef = useRef(null);
  const PasswordRef = useRef(null);

  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    // Validation checks
    //  if (PasswordRef.current.value !== ConfirmPasswordRef.current.value) {
    //  return setError("Passwords Do Not Match.");
    //  }

    try {
      // Function awaits the log in
      setError("");
      setLoading(true);
      await login(EmailRef.current.value, PasswordRef.current.value);
      // take the user to the navigation bar
      navigate("/");
    } catch (error) {
      // setError(error.message)
      console.error(error.message);
      setError("Failed to Log In.");
    }
    // to prevent user from pressing sign up multiple times
    setLoading(false);
  }

  return (
    <Paper
      elevation={4}
      sx={{
        mt: 7,
        backgroundColor: "white",
        width: 700,
        marginLeft: "23%",
        height: 450,
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
            Log In
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
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  inputRef={EmailRef}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  inputRef={PasswordRef}
                />
              </Grid>
              <Grid item xs={12}></Grid>
            </Grid>
            <Button
              disabled={loading}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                Don't Have An Account?{" "}
                <Link to="/signup" style={{ color: "blue" }}>
                  Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
}
