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
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Modal from "@mui/material/Modal";

const remainingEmailsMessage = (emailCount, maxEmails) => {
  if (emailCount < maxEmails) {
    return `You have ${maxEmails - emailCount} email(s) left.`;
  }

  return "You cannot contact them anymore, you have already sent three emails.";
};
// sending others emails
// const sendEmail = (e) => {
//   e.preventDefault();

// First check if the user can send them messages
//   if (emailCount >= maxEmails) {
//     alert(
//       "You cannot contact them anymore, you have already sent three emails."
//     );
//     return;
//   }

//   emailjs
//     .sendForm(
//       "service_dnc473a",
//       "template_1w5ueo3",
//       e.target,
//       "N1abVoGcbh8XG1Gp7"
//     )
//     .then(
//       (result) => {
//         console.log(result.text); // Handle the success response here
//         e.target.reset();
//         setEmailCount(emailCount + 1);
//       },
//       (error) => {
//         console.log(error.text); // Handle the error response here
//       }
//     );
// };

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
            src={
              profile.profileImage ||
              require("../components/assets/profile-photo.webp")
            }
            // alt={`${profile.firstName} ${profile.lastName}`}
            style={{
              border: "1px solid #393939",
              boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.3)",
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
const ProfilePopup = ({
  profile,
  onClose,
  emailCount,
  setEmailCount,
  maxEmails,
}) => {
  //State variables to keep track of the amount of emails sent to another user

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

    if (emailCount >= maxEmails) {
      alert(
        "You cannot contact them anymore, you have already sent three emails."
      );
      return;
    }
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
          e.target.reset();
          setEmailCount(emailCount + 1);
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
                src={
                  profile.profileImage ||
                  require("../components/assets/profile-photo.webp")
                }
           

                style={{
                  border: "1px solid #393939",
                  boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.3)",
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
        {emailCount < maxEmails && (
          <Typography
            sx={{
              fontFamily: "Times New Roman",
              marginTop: "20px",
              textAlign: "left",
              marginLeft: "150px",
              marginBottom: "5px",
              maxWidth: "80%",
            }}
          >
            {remainingEmailsMessage(emailCount, maxEmails)}
          </Typography>
        )}

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
              disabled={emailCount >= maxEmails}
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
  // keep track of the emails sent to avoid spam
  const [emailCount, setEmailCount] = useState(0);
  const [emailCounts, setEmailCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSDGs, setSelectedSDGs] = useState("");
  const [openFilter, setOpenFilter] = useState(false); // State to handle filter visibility
  const maxEmails = 3;

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };
  useEffect(() => {
    const fetchProfiles = async () => {
      const profilesCollection = collection(db, "profiles");
      const profilesSnapshot = await getDocs(profilesCollection);
      const profilesList = profilesSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => a.firstName.localeCompare(b.firstName));

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
    if (!emailCount[profile.id]) {
      setEmailCount({ ...emailCount, [profile.id]: 0 });
    }
    // setEmailCounts((prevCounts) => ({
    //   ...prevCounts,
    //   [profile.id]: prevCounts[profile.id] || 0,
    // }));
  };

  //filter researchers by search query
  const filteredProfiles = profiles.filter((profile) => {
    const fullName =
      `${profile.title} ${profile.firstName} ${profile.lastName}`.toLowerCase();
    const bio = (profile.biography || "").toLowerCase();
    const currentProjects = (profile.currentProjects || "").toLowerCase();
    const sdgInterests = (profile.researchInterests || [])
      .join(" ")
      .toLowerCase();

    const matchesSearchQuery =
      fullName.includes(searchQuery.toLowerCase()) ||
      bio.includes(searchQuery.toLowerCase()) ||
      currentProjects.includes(searchQuery.toLowerCase()) ||
      sdgInterests.includes(searchQuery.toLowerCase());

    const matchesSDGInterests =
      selectedSDGs.length === 0 ||
      profile.researchInterests?.some((sdg) => selectedSDGs.includes(sdg));
    return matchesSearchQuery && matchesSDGInterests;
  });

  const handleSDGChange = (event) => {
    const value = event.target.value;
    const newSelectedSDGs = selectedSDGs.includes(value)
      ? selectedSDGs.filter((sdg) => sdg !== value)
      : [...selectedSDGs, value];
    setSelectedSDGs(newSelectedSDGs);
  };

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
  const clearSDGSelection = () => {
    setSelectedSDGs([]);
  };

  // paper components style

  const paperStyle = {
    // marginLeft: "70px",
    //padding: "15px",
    margin: "15px",
    marginTop: "10px",
    marginBottom: "15px",
    display: "flex",

    alignItems: "center",
    justifyContent: "space-between",
    width: "calc(25% - 30px)",
    height: 400,
    backgroundColor: "#F8FAFB",
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <p className="researchers-title">Researchers</p>
        <TextField // Search bar
          label="Search Researchers..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            margin: "10px 10px",
            marginLeft: "40px",
            width: 1250,
          }}
          sx={{
            borderRadius: "20px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
            },
          }}
        />
        <Button
          onClick={() => setOpenFilter(true)}
          sx={{
            marginRight: "30px",
            fontSize: "0.8rem",
          }}
        >
          Filter
        </Button>
        <Modal
          open={openFilter}
          onClose={handleCloseFilter}
          sx={{
            //Drop down box for SDG filter
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
            marginRight: "60px",
            marginTop: "-80px",
          }}
          BackdropProps={{ style: { backgroundColor: "transparent" } }}
        >
          <Box
            sx={{
              width: 430, // Width of the dropdown
              maxHeight: 230,
              overflowY: "auto", // Make it scrollable
              bgcolor: "background.paper",
              p: 2,
              border: "1px solid #c4c4c4",
              borderRadius: "10px", // Make it rounded
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={clearSDGSelection}
                sx={{
                  fontSize: "0.8rem",
                  marginBottom: "-20px",
                  marginLeft: 45, // Align the button to the right
                }}
              >
                Clear
              </Button>
            </Box>
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
                  sx={{ fontSize: "0.8rem" }} // Smaller font size
                />
              ))}
            </FormGroup>
          </Box>
        </Modal>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", cursor: "pointer" }}>
        {filteredProfiles.map((profile, index) => (
          <Paper
            key={index}
            elevation={3}
            style={{
              ...paperStyle,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
            onClick={() => handleProfileClick(profile)}
          >
            <img
              src={
                profile.profileImage ||
                require("../components/assets/profile-photo.webp")
              }
              style={{
                border: "0.5px solid #393939",
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.3)",
                borderRadius: "50%",
                marginTop: "70px",
                // margin: "20px",
                width: "150px",
                height: "150px",
              }}
            />
            <div style={{ textAlign: "center", padding: "10px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginTop: "-150px",
                  fontSize: "18px",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                  {profile.title}
                </div>
                <div
                  style={{ marginLeft: "5px", marginBottom: "5px" }}
                >{`${profile.firstName} ${profile.lastName}`}</div>
              </div>
              <div style={{ cursor: "pointer" }}>{profile.role}</div>
            </div>
            <IconButton
              onClick={(event) => handleContactClick(event, profile)}
              className="noHoverEffect"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
                fontFamily: "Times New Roman",
                color: "black",
                fontSize: "16px",
              }}
            >
              Contact{" "}
              <EmailOutlinedIcon
                style={{ color: "black", marginLeft: "5px" }}
              />
            </IconButton>
          </Paper>
        ))}
      </div>

      {selectedProfile && (
        <Modal
          open={selectedProfile}
          onClose={handleClosePopup}
          BackdropProps={{ style: { backgroundColor: "transparent" } }}
        >
          <ProfileInfoPopup
            profile={selectedProfile}
            onClose={handleClosePopup}
          />
        </Modal>
      )}

      {contactProfile && (
        <Modal
          open={contactProfile}
          onClose={handleClosePopup}
          BackdropProps={{ style: { backgroundColor: "transparent" } }}
        >
          <ProfilePopup
            profile={contactProfile}
            onClose={handleClosePopup}
            emailCount={emailCounts[contactProfile.id] || 0}
            setEmailCount={(count) =>
              setEmailCounts({ ...emailCounts, [contactProfile.id]: count })
            }
            maxEmails={maxEmails}
          />
        </Modal>
      )}
    </div>
  );
}
