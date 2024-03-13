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
import { Typography, Link } from "@mui/material";
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
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InfoIcon from "@mui/icons-material/Info";
import { setDoc } from "firebase/firestore";
import "../components/style/ErrorMessages.css";

const remainingEmailsMessage = (emailCount, maxEmails) => {
  if (emailCount < maxEmails) {
    return `You have ${maxEmails - emailCount} email(s) left.`;
  }

  return "You have already sent three emails, please wait for them to reply.";
};

const ProfileInfoPopup = ({
  profile,
  onClose,
  handleContactClick,
  emailCounts,
}) => {
  const maxEmails = 3;
  const [errorMessage, setErrorMessage] = useState({ text: "", show: false });
  const [confirmMessage, setConfirmMessage] = useState({
    text: "",
    show: false,
  });

  const { currentUser } = useAuth();
  const [profileofCurrentUser, setProfileofCurrentUser] = useState(null);
  const [sdgTooltip, setSdgTooltip] = useState({
    show: false,
    text: "",
    x: 0,
    y: 0,
  });

  const sdgTooltips = [
    "End poverty in all its forms everywhere.",
    "End hunger, achieve food security and improved nutrition, and promote sustainable agriculture.",
    "Ensure healthy lives and promote well-being for all at all ages.",
    "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.",
    "Achieve gender equality and empower all women and girls.",
    "Ensure availability and sustainable management of water and sanitation for all.",
    "Ensure access to affordable, reliable, sustainable, and modern energy for all.",
    "Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.",
    "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation.",
    "Reduce inequality within and among countries.",
    "Make cities and human settlements inclusive, safe, resilient, and sustainable.",
    "Ensure sustainable consumption and production patterns.",
    "Take urgent action to combat climate change and its impacts.",
    "Conserve and sustainably use the oceans, seas and marine resources for sustainable development.",
    "Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss.",
    "Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels.",
    "Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development.",
  ];
  if (sdgTooltip.show) {
    console.log("Tooltip top position (sdgTooltip.y):", sdgTooltip.y);
  }

  const showSdgTooltip = (sdgIndex, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + window.scrollX + rect.width / 2 - 100; // Centers the tooltip on the X-axis
    const offset = 10; // 10px space between the image bottom and the tooltip
    // Calculate Y to place the tooltip just below the image, including any scroll offset and a small space
    const y = rect.bottom + offset + 170;

    setSdgTooltip({
      show: true,
      text: sdgTooltips[sdgIndex],
      x,
      y,
    });

    setSdgTooltip({
      show: true,
      text: sdgTooltips[sdgIndex],
      x,
      y,
    });
  };
  const hideSdgTooltip = () => {
    console.log("Hiding SDG tooltip");
    setSdgTooltip({ show: false, text: "", x: 0, y: 0 });
  };
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
  const SDGImages = ({ researchInterests, showSdgTooltip, hideSdgTooltip }) => {
    const getSDGImagePath = (sdgNumber) => `./SDG/SDG${sdgNumber}.png`;
    const sortedInterests = researchInterests
      .map((interest) => ({
        interest,
        number: parseInt(interest.match(/SDG(\d+)/)[1], 10), // Extracts and parses the number
      }))
      .sort((a, b) => a.number - b.number) // Sort by the SDG number
      .map((item) => item.interest); // Map back to the original interest string

    const toggleSdgTooltip = (sdgIndex, event) => {
      if (sdgTooltip.show && sdgTooltip.text === sdgTooltips[sdgIndex]) {
        hideSdgTooltip();
      } else {
        showSdgTooltip(sdgIndex, event);
      }
    };
    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {researchInterests.map((interest, index) => {
          const sdgNumber = interest.match(/SDG(\d+)/)[1];
          return (
            <ClickAwayListener onClickAway={hideSdgTooltip} key={index}>
              <div
                style={{
                  position: "relative",
                  marginRight: "10px",
                  marginBottom: "5px",
                }}
              >
                <img
                  src={getSDGImagePath(sdgNumber)}
                  alt={`SDG ${sdgNumber}`}
                  style={{
                    width: "200px",
                    height: "200px",
                  }}
                />
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSdgTooltip(index, e);
                  }}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,

                    color: "white",
                    cursor: "pointer",
                    backgroundColor: "transparent",
                    borderRadius: "50%",
                  }}
                >
                  <InfoIcon />
                </IconButton>
              </div>
            </ClickAwayListener>
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
        zIndex: 300,
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
          marginTop: "10px",
          marginLeft: "30px",
        }}
      >
        X
      </button>
      {(emailCounts[profile.id] + 1 || 0) < maxEmails && (
        <IconButton
          onClick={(event) => handleContactClick(event, profile)}
          className="noHoverEffect"
          style={{
            position: "absolute",
            top: "20px",
            right: "10px",
            cursor: "pointer",
            fontFamily: "Tensor Sans",
            color: "black",
            fontSize: "16px",
            marginRight: "60px",
          }}
        >
          Contact{" "}
          <EmailOutlinedIcon style={{ color: "black", marginLeft: "5px" }} />
        </IconButton>
      )}
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
                fontFamily: "Tensor Sans",
              }}
            >
              {`${profile.title} ${profile.firstName} ${profile.lastName}`}
            </Typography>
            <Typography
              component="h1"
              variant="h5"
              sx={{
                fontFamily: "Tensor Sans",
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
          fontFamily: "Tensor Sans",
          marginTop: "40px",
          marginBottom: "20px",
          marginLeft: "120px",
          textAlign: "left",
          maxWidth: "80%",
        }}
      >
        <strong>LinkedIn: </strong>
        <Link
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          sx={{ display: "inline-flex", alignItems: "center" }}
        >
          {profile.linkedinName}{" "}
          <OpenInNewIcon
            sx={{ display: "inline-flex", alignItems: "center", fontSize: 13 }}
          />
        </Link>
      </Typography>
      <Typography
        sx={{
          fontFamily: "Tensor Sans",
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
          fontFamily: "Tensor Sans",
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
          fontFamily: "Tensor Sans",
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
          <SDGImages
            researchInterests={profile.researchInterests}
            showSdgTooltip={showSdgTooltip}
            hideSdgTooltip={hideSdgTooltip}
            sdgTooltip={sdgTooltip}
          />
        </div>
      </Typography>

      {sdgTooltip.show && (
        <div
          style={{
            position: "fixed",
            top: sdgTooltip.y - 190,
            left: sdgTooltip.x,
            maxWidth: "23ch",
            backgroundColor: "white",
            border: "1px solid #DDD",
            borderRadius: "4px",
            padding: "8px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
            zIndex: 400,
            justifyContent: "center",
          }}
        >
          {sdgTooltip.text}
        </div>
      )}
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
  confirmMessage,
  setConfirmMessage,

  errorMessage,
  setErrorMessage,

  emailCounts,
}) => {
  //State variables to keep track of the amount of emails sent to another user

  const { currentUser } = useAuth();
  const [profileofCurrentUser, setProfileofCurrentUser] = useState(null);
  const senderEmail = profileofCurrentUser?.email; // Email of the current logged-in user

  useEffect(() => {
    async function fetchEmailCount() {
      const emailCountsRef = doc(
        db,
        "emailCounts",
        `${currentUser.uid}_${profile.id}`
      );
      const docSnap = await getDoc(emailCountsRef);

      if (docSnap.exists()) {
        setEmailCount(docSnap.data().count);
      } else {
        setEmailCount(0);
      }
    }

    if (currentUser && profile) {
      fetchEmailCount();
    }
  }, [currentUser, profile]);

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
    console.log("Sending email...");
    e.preventDefault();

    if (emailCount >= maxEmails) {
      alert(
        "You cannot contact them anymore, you have already sent three emails."
      );
      return;
    }

    emailjs
      .sendForm(
        "service_dnc473a",
        "template_1w5ueo3",
        e.target,
        "N1abVoGcbh8XG1Gp7"
      )
      .then(
        (result) => {
          e.target.reset();
          const newCount = emailCount + 1;
          setEmailCount(newCount);
          if (newCount >= maxEmails) {
            setErrorMessage({
              text: "You have already contacted them three times. Please wait until they reply.",
              show: true,
            });
            setTimeout(() => setErrorMessage({ text: "", show: false }), 8000);
            onClose(); // Close the contact popup
          } else {
            setConfirmMessage({
              text: `Email has been sent. You now have ${
                maxEmails - newCount
              } email(s) left.`,
              show: true,
            });
            setTimeout(
              () => setConfirmMessage({ text: "", show: false }),
              5000
            );
          }
          setTimeout(() => {
            setConfirmMessage({ text: "", show: false });
          }, 5000);
          // Update the Firestore database with the new count
          const emailCountsRef = doc(
            db,
            "emailCounts",
            `${currentUser.uid}_${profile.id}`
          );
          setDoc(emailCountsRef, { count: newCount }, { merge: true });
        },
        (error) => {
          console.log("Send email error:", error.text);
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
        zIndex: 300,
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
          left: 30,
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
            fontFamily: "Tensor Sans",
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
                  fontFamily: "Tensor Sans",
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
              disabled={emailCount >= maxEmails}
              sx={{
                mt: 5,
                mb: 2,
                width: 400,
                fontFamily: "Tensor Sans",
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
  const [confirmMessage, setConfirmMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [contactProfile, setContactProfile] = useState(null);
  const maxEmails = 3;
  // keep track of the emails sent to avoid spam
  const [emailCount, setEmailCount] = useState(0);
  const [emailCounts, setEmailCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSDGs, setSelectedSDGs] = useState("");
  const [openFilter, setOpenFilter] = useState(false); // State to handle filter visibility

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
    if (emailCounts[profile.id] >= maxEmails) {
      setErrorMessage({
        text: "You have already contacted them three times. You cannot contact them anymore.",
        show: true,
      });
      setTimeout(() => setErrorMessage({ text: "", show: false }), 5000);
      setContactProfile(null); // Close the contact popup
    } else {
      setContactProfile(profile);
      setSelectedProfile(null);
    }
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
    <div className="flex flex-col items-center justify-center">
      <div>
        {errorMessage.show && (
          <div className="errorMessage">{errorMessage.text}</div>
        )}

        {confirmMessage.show && (
          <div className="confirmMessage">{confirmMessage.text}</div>
        )}
        <h2 className="researchers-title">Researchers</h2>
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

            {(emailCounts[profile.id] + 1 || 0) <= maxEmails && (
              <IconButton
                onClick={(event) => handleContactClick(event, profile)}
                className="noHoverEffect"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  cursor: "pointer",
                  fontFamily: "Tensor Sans",
                  color: "black",
                  fontSize: "16px",
                }}
              >
                Contact{" "}
                <EmailOutlinedIcon
                  style={{ color: "black", marginLeft: "5px" }}
                />
              </IconButton>
            )}
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
            handleContactClick={handleContactClick}
            emailCounts={emailCounts}
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
            confirmMessage={confirmMessage}
            setConfirmMessage={setConfirmMessage}
            emailCounts={emailCounts}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        </Modal>
      )}
    </div>
  );
}
