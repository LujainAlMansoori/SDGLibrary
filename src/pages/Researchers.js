import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Paper from "@mui/material/Paper";
import "../components/style/titles.css";
import IconButton from "@mui/material/IconButton";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import "../components/style/noHover.css";
import emailjs from "emailjs-com";
import { useAuth } from "../contexts/AuthContexts";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { doc, getDoc } from "firebase/firestore";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

// sending others emails
const sendEmail = (e) => {
  e.preventDefault();

  emailjs
    .sendForm(
      "service_dnc473a",
      "template_1w5ueo3",
      e.target,
      "N1abVoGcbh8XG1Gp7"
    )
    .then(
      (result) => {
        console.log(result.text); // Handle the success response here
      },
      (error) => {
        console.log(error.text); // Handle the error response here
      }
    );
};

const ProfileInfoPopup = ({ profile, onClose }) => {
  const { currentUser } = useAuth();
  const [profileofCurrentUser, setProfileofCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchProfileofCurrentUser() {
      if (currentUser) {
        const profileDoc = await getDoc(doc(db, "profiles", currentUser.uid));
        if (profileDoc.exists()) {
          const data = profileDoc.data();
          console.log("Current user profile data:", data);
          setProfileofCurrentUser(data);
        } else {
          console.log("No such profile for current user!");
        }
      }
    }

    fetchProfileofCurrentUser();
  }, [currentUser]);

  // Do not render the popup until the profile is loaded
  if (!profile) return null;

  // Do not render the popup until both profiles are loaded
  if (!profile || !profileofCurrentUser) {
    return null;
  }

  const getSDGImagePath = (sdgNumber) => {
    const imagePath = `./SDG/SDG${sdgNumber}.png`;
    console.log(`Generated image path: ${imagePath}`); // This will print the path for each SDG image
    return imagePath;
  };

  // Component to render SDG images
  const SDGImages = ({ researchInterests }) => {
    const sortedInterests = researchInterests
      .map((interest) => ({
        interest,
        number: parseInt(interest.match(/SDG(\d+)/)[1], 10), // Extracts and parses the number
      }))
      .sort((a, b) => a.number - b.number) // Sort by the SDG number
      .map((item) => item.interest); // Map back to the original interest string
    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {sortedInterests.map((interest, index) => {
          const sdgNumber = interest.match(/SDG(\d+)/)[1]; // Extracts the number from the string
          return (
            <img
              key={index}
              src={getSDGImagePath(sdgNumber)}
              alt={`SDG ${sdgNumber}`}
              style={{
                width: "100px",
                height: "100px",
                marginRight: "5px", // Add space between images
                marginBottom: "5px", // Wrap to the next line for every 5 images
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      className="popup-container"
      style={{
        position: "fixed",
        top: 69,
        right: 0,
        bottom: 0,
        width: "75%",
        backgroundColor: "white",
        zIndex: 1000,
        overflowY: "auto",
        border: "1px solid #e0e0e0",
        boxShadow:
          "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)", // Example shadow, similar to Material-UI Paper elevation=3
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          cursor: "pointer",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          backgroundColor: "#f0f0f0",
          color: "black",
          fontSize: "10px",
        }}
      >
        X
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "90px" }}
        >
          <img
            src={profile.profileImage}
            alt={`${profile.firstName} ${profile.lastName}`}
            style={{
              width: "125px",
              height: "125px",
              borderRadius: "50%",

              marginRight: "40px",
            }}
          />
          <div>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontFamily: "Times New Roman",
              }}
            >
              {`${profile.title} ${profile.firstName} ${profile.lastName}`}
            </Typography>
            <Typography
              component="h1"
              variant="h5"
              sx={{
                fontFamily: "Times New Roman",
                marginBottom: "20px",
              }}
            >
              {profile.role}
            </Typography>
          </div>
        </div>
      </div>

      <Typography
        sx={{
          fontFamily: "Times New Roman",
          marginTop: "40px",
          marginBottom: "20px",
          marginLeft: "120px",
          textAlign: "left",
          maxWidth: "80%",
        }}
      >
        <strong>
          Biography: <b></b>
        </strong>
        <div>{profile.biography}</div>
      </Typography>
      <Typography
        sx={{
          fontFamily: "Times New Roman",
          textAlign: "left",
          marginLeft: "120px",
          maxWidth: "80%",
          marginBottom: "20px",
        }}
      >
        <strong>
          Current Projects: <b></b>
        </strong>
        <div>{profile.currentProjects}</div>
      </Typography>

      <Typography
        sx={{
          fontFamily: "Times New Roman",
          textAlign: "left",
          marginLeft: "120px",
          maxWidth: "80%",
          marginBottom: "20px",
        }}
      >
        <strong>
          SDG Interests: <b></b>
        </strong>
        <div>
          {" "}
          <SDGImages researchInterests={profile.researchInterests} />
        </div>
      </Typography>
    </div>
  );
};

// Popup component for sending emails
const ProfilePopup = ({ profile, onClose }) => {
  const { currentUser } = useAuth();
  const [profileofCurrentUser, setProfileofCurrentUser] = useState(null);
  const senderEmail = profileofCurrentUser?.email; // Email of the current logged-in user
  useEffect(() => {
    async function fetchProfileofCurrentUser() {
      if (currentUser) {
        const profileDoc = await getDoc(doc(db, "profiles", currentUser.uid));
        if (profileDoc.exists()) {
          const data = profileDoc.data();
          console.log("Current user profile data:", data);
          setProfileofCurrentUser(data);
        } else {
          console.log("No such profile for current user!");
        }
      }
    }

    fetchProfileofCurrentUser();
  }, [currentUser]);

  // Do not render the popup until the profile is loaded
  if (!profile) return null;

  const sendEmail = (e) => {
    e.preventDefault();

    console.log("Sender Email:", profileofCurrentUser?.email); // Print sender email
    console.log("Receiver Email:", profile?.email); // Print receiver email

    emailjs
      .sendForm(
        "service_dnc473a",
        "template_1w5ueo3",
        e.target,
        "N1abVoGcbh8XG1Gp7"
      )
      .then(
        (result) => {
          console.log("Email sent result:", result.text); // This will print the result of sending the email
        },
        (error) => {
          console.log("Send email error:", error.text); // This will print the error if email sending fails
        }
      );
  };

  // Do not render the popup until both profiles are loaded
  if (!profile || !profileofCurrentUser) {
    return null;
  }
  return (
    <div
      className="popup-container"
      style={{
        position: "fixed",
        top: 69,
        right: 0,
        bottom: 0,
        width: "75%",
        backgroundColor: "white",
        zIndex: 1000,
        overflowY: "auto",
        border: "1px solid #e0e0e0",
        boxShadow:
          "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          cursor: "pointer",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          backgroundColor: "#f0f0f0",
          color: "black",
          fontSize: "10px",
        }}
      >
        X
      </button>
      {/* Popup content  */}

      <div>
        <Typography
          type="submit"
          component="h1"
          variant="h4"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Times New Roman",
            paddingTop: "50px",
            margin: "auto",
            width: "100%",
            mt: 3,
            mb: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "40px",
              }}
            >
              <img
                src={profile.profileImage}
                alt={`${profile.firstName} ${profile.lastName}`}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  marginRight: "40px",
                }}
              />
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontFamily: "Times New Roman",
                }}
              >
                Contact{" "}
                {`${profile.title} ${profile.firstName} ${profile.lastName}`}
              </Typography>
            </div>
          </div>
        </Typography>

        {/* Popup content */}
        <div>
          <form onSubmit={sendEmail}>
            <input
              type="hidden"
              name="from_name"
              value={`${profileofCurrentUser?.title} ${profileofCurrentUser?.firstName} ${profileofCurrentUser?.lastName}`}
            />
            <input
              type="hidden"
              name="to_name"
              value={`${profile.title} ${profile.firstName} ${profile.lastName}`}
            />

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={12}
                name="message"
                label="Your Message"
                sx={{
                  maxWidth: "70%",
                  marginLeft: "150px",

                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
              />
            </Grid>

            <input
              type="hidden"
              name="from_email"
              value={`${profileofCurrentUser?.email}`}
            />
            <input type="hidden" name="to_email" value={profile.email} />

            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 5,
                mb: 2,
                width: 400,
                fontFamily: "Times New Roman",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Send Email
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function Researchers() {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [contactProfile, setContactProfile] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      const profilesCollection = collection(db, "profiles");
      const profilesSnapshot = await getDocs(profilesCollection);
      const profilesList = profilesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProfiles(profilesList);
    };

    fetchProfiles();
  }, []);

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setContactProfile(null); // Close the contact popup if it's open
  };

  const handleClosePopup = () => {
    setSelectedProfile(null);
    setContactProfile(null);
  };

  const handleContactClick = (event, profile) => {
    event.stopPropagation();
    setContactProfile(profile);
    setSelectedProfile(null); // Close the profile info popup if it's open
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <p className="researchers-title">Researchers</p>
      </div>
      {profiles.map((profile, index) => (
        <Paper
          key={index}
          elevation={3}
          style={{
            padding: "20px",
            margin: "10px 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: 1400,
            height: 100,
          }}
          onClick={() => handleProfileClick(profile)}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={profile.profileImage}
              alt={`${profile.firstName} ${profile.lastName}`}
              style={{
                borderRadius: "50%",
                marginRight: "40px",
                marginLeft: "40px",
                width: "80px",
                height: "80px",
              }}
            />
            <div>
              <div style={{ cursor: "pointer" }}>
                <div>{`${profile.title} ${profile.firstName} ${profile.lastName}`}</div>
                <br />
                <div>{profile.role}</div>
              </div>
            </div>
          </div>
          <IconButton
            onClick={(event) => handleContactClick(event, profile)}
            className="noHoverEffect"
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              marginRight: "20px",
              fontFamily: "Times New Roman",
              color: "black",
              fontSize: "16px",
              marginTop: "-20px",
            }}
          >
            Contact{" "}
            <EmailOutlinedIcon style={{ color: "black", marginLeft: "5px" }} />
          </IconButton>
        </Paper>
      ))}
      {selectedProfile && (
        <ProfileInfoPopup
          profile={selectedProfile}
          onClose={handleClosePopup}
        />
      )}
      {contactProfile && (
        <ProfilePopup profile={contactProfile} onClose={handleClosePopup} />
      )}
    </div>
  );
}
