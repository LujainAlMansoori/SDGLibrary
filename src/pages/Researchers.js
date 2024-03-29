import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Paper from "@mui/material/Paper";
import "../components/style/titles.css";
import IconButton from "@mui/material/IconButton";
import { useLocation } from "react-router-dom";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import "../components/style/noHover.css";
import FilterListIcon from "@mui/icons-material/FilterList";
import emailjs from "emailjs-com";
import { useAuth } from "../contexts/AuthContexts";
import Popover from "@mui/material/Popover";

import { useContactStatus } from "../contexts/ContactContext.js";
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
import { useNavigate } from "react-router-dom";

import "../components/style/ErrorMessages.css";

import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";

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
  const { contactDisabled } = useContactStatus();
  const isContactDisabled =
    contactDisabled[profile.id] ||
    emailCounts[`${currentUser?.uid}_${profile?.id}`] + 1 >= maxEmails;

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
        {sortedInterests.map((interest, index) => {
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

      {/*this is the email icon for the profile pop up */}
      {!contactDisabled ? (
        <IconButton
          onClick={(event) =>
            !isContactDisabled && handleContactClick(event, profile)
          }
          className="noHoverEffect"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            cursor: "pointer",
            fontFamily: "Tensor Sans",
            color: "black",
            fontSize: "16px",
            backgroundColor: "transparent",
            ":hover": {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          }}
          disabled={!contactDisabled}
        >
          Contact{" "}
          <EmailOutlinedIcon
            sx={{
              color: "black",
              marginLeft: "5px",
              ":hover": {
                backgroundColor: "transparent",
              },
            }}
          />
        </IconButton>
      ) : (
        <IconButton
          sx={{
            color: "grey",
            marginLeft: "5px",
            ":hover": {
              backgroundColor: "transparent",
            },
          }}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            cursor: "not-allowed",
            fontFamily: "Tensor Sans",
            color: "grey",
            // Remove any box-shadow or border that might appear on hover
            //
            "&:hover": {
              backgroundColor: "transparent",
              boxShadow: "none",
              border: "none",
            },
            fontSize: "16px",
          }}
        >
          Contact{" "}
          <EmailOutlinedIcon
            sx={{
              color: "grey",
              marginLeft: "5px",
              ":hover": {
                backgroundColor: "transparent",
              },
            }}
          />
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
          <div style={{ marginLeft: "-60px" }}>
            {" "}
            {/* Move the image 60px to the left */}
            <img
              src={
                profile.profileImage ||
                require("../components/assets/profile-photo.webp")
              }
              style={{
                border: "1px solid #393939",
                boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.3)",
                width: "125px",
                height: "125px",
                borderRadius: "50%",
                marginRight: "20px",
              }}
            />
          </div>
          <div style={{ maxWidth: "300px" }}>
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
                wordWrap: "break-word",
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
  setShowContactButton,
}) => {
  //State variables to keep track of the amount of emails sent to another user
  const { disableContact } = useContactStatus();
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
      console.log(`Disabling contact for profile ID: ${profile.id}`);
      disableContact(profile.id);

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
            disableContact(profile.id);
            console.log(`Disabling contact for profile ID: ${profile.id}`);
            setErrorMessage({
              text: "You have already contacted them three times. Please wait until they reply.",
              show: true,
            });
            setTimeout(() => setErrorMessage({ text: "", show: false }), 8000);
            onClose(); // Close the contact popup
            const updatedEmailCounts = {
              ...emailCounts,
              [`${currentUser.uid}_${profile.id}`]: newCount,
            };
            setEmailCount(updatedEmailCounts);
            setShowContactButton((prevState) => ({
              ...prevState,
              [profile.id]: false,
            }));
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
          setErrorMessage({
            text: "Failed to send email.",
            show: true,
          });
          setTimeout(() => setErrorMessage({ text: "", show: false }), 5000);
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
  const location = useLocation();

  const { contactDisabled, disableContact, enableContact } = useContactStatus();
  const [showProfileAlert, setShowProfileAlert] = useState(false);

  const navigate = useNavigate();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showContactButton, setShowContactButton] = useState({});

  const { currentUser } = useAuth();
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
    async function checkUserProfile() {
      if (currentUser) {
        const docRef = doc(db, "profiles", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (
          !docSnap.exists() ||
          !docSnap.data().firstName ||
          !docSnap.data().lastName ||
          !docSnap.data().role
        ) {
          navigate("/createprofile", { state: { from: "researchers" } });
          setShowProfileAlert(true);
        }
      }
    }

    checkUserProfile();
  }, [currentUser, navigate]);
  useEffect(() => {
    const checkUserProfile = async () => {
      if (currentUser) {
        const docRef = doc(db, "profiles", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (
          !docSnap.exists() ||
          !docSnap.data().firstName ||
          !docSnap.data().lastName ||
          !docSnap.data().role
        ) {
          navigate("/createprofile", {
            state: { from: "researchers", showProfileAlert: true },
          });
        }
      }
    };

    checkUserProfile();
  }, [currentUser, navigate]);

  useEffect(() => {
    if (location.state?.success) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000); // 5000 milliseconds = 5 seconds

      return () => clearTimeout(timer); // Clean up the timer when the component unmounts
    }
  }, [location.state?.success]);
  useEffect(() => {
    const fetchProfiles = async () => {
      const profilesCollection = collection(db, "profiles");
      const profilesSnapshot = await getDocs(profilesCollection);
      const profilesList = profilesSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        .filter((profile) => profile.id !== currentUser.uid) // Filter out the current user's profile
        .sort((a, b) => a.firstName.localeCompare(b.firstName));

      setProfiles(profilesList);
    };

    fetchProfiles();
  }, [currentUser]);

  const fetchEmailCount = async (userId, profileId) => {
    const emailCountsRef = doc(db, "emailCounts", `${userId}_${profileId}`);
    const docSnap = await getDoc(emailCountsRef);

    if (docSnap.exists()) {
      setEmailCounts((prev) => ({
        ...prev,
        [`${userId}_${profileId}`]: docSnap.data().count,
      }));
    } else {
      setEmailCounts((prev) => ({ ...prev, [`${userId}_${profileId}`]: 0 }));
    }
  };

  useEffect(() => {
    // Other useEffect contents

    if (currentUser && profiles.length > 0) {
      profiles.forEach((profile) => {
        // Make sure you pass the correct arguments to fetchEmailCount
        fetchEmailCount(currentUser.uid, profile.id);
      });
    }
  }, [currentUser, profiles]);
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
      disableContact(profile.id);

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

  const handleOpenFilter = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenFilter(true);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedFilters, setSelectedFilters] = React.useState([]);

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedSDGs([...selectedSDGs, name]);
    } else {
      setSelectedSDGs(selectedSDGs.filter((sdg) => sdg !== name));
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
    margin: "1.2%",

    marginBottom: "3%",
    display: "flex",

    alignItems: "center",
    justifyContent: "space-between",
    width: "25vw",
    height: "auto",
    backgroundColor: "#F8FAFB",
  };

  useEffect(() => {
    const initialButtonVisibility = profiles.reduce((acc, profile) => {
      acc[profile.id] = true; // Initially, all buttons are visible
      return acc;
    }, {});

    setShowContactButton(initialButtonVisibility);
  }, [profiles, currentUser]);
  return (
    <div>
      {showSuccessMessage && (
        <div className="confirmMessage">
          <Typography>{location.state.success}</Typography>
        </div>
      )}
      <div className="flex flex-col items-center justify-center">
        <div>
          {errorMessage.show && (
            <div className="errorMessage">{errorMessage.text}</div>
          )}

          {confirmMessage.show && (
            <div className="confirmMessage">{confirmMessage.text}</div>
          )}
          <h2 className="researchers-title">SDGLibrary Members</h2>

          <div
            style={{
              marginTop: "-1%",
              marginBottom: "4%",

              display: "flex",
              justifyContent: "center",
            }}
          >
            <TextField // Search bar
              label="Search Members..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "70vw",
                marginTop: "-20px",
              }}
              InputLabelProps={{
                style: {
                  fontSize: "calc(0.2rem + 1vw)",
                  top: "5%",
                  background: "#fff",
                  marginLeft: "0.5%",
                  marginBottom: "1%",
                  padding: "0vw 5vh",
                  backgroundColor: "#fff",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25vw",
                  height: "auto",
                  padding: "0 14px",
                },
                "& .MuiInputBase-input": {
                  fontSize: "calc(0.4rem + 1vw)",
                  overflow: "hidden",
                  marginLeft: "2%",
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: "calc(1rem + 1vw)",
                        },
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              onClick={handleOpenFilter}
              sx={{
                marginRight: "1vw",
                fontSize: "1rem",
                color: "#464646",
                marginTop: "-2vw",
                "&:hover": {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
                "&:focus": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <FilterListIcon sx={{ fontSize: "2vw" }} />
            </Button>
            <Popover
              open={openFilter}
              anchorEl={anchorEl}
              onClose={handleCloseFilter}
              anchorOrigin={{
                //
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                sx: {
                  marginTop: "-3.5%", // Adjust this value to move the popover up
                },
              }}
            >
              <Box
                sx={{
                  width: "calc(1rem + 35vw)",
                  maxHeight: "calc(1rem + 15vw)",
                  overflowY: "auto",
                  bgcolor: "background.paper",
                  p: 2,
                  border: "1px solid #c4c4c4",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    onClick={clearSDGSelection}
                    sx={{
                      fontSize: "0.8vw",
                      marginBottom: "-20px",
                      marginLeft: "90%", // Align the button to the right
                    }}
                  >
                    Clear
                  </Button>
                </Box>
                {sdglist.map((sdg, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        name={sdg}
                        checked={selectedSDGs.includes(sdg)}
                        onChange={handleFilterChange}
                      />
                    }
                    label={sdg}
                    sx={{
                      display: "block",
                      "& .MuiTypography-root": {
                        // Target the label typography
                        fontSize: "calc(0.8rem + 0.5vw)", // Dynamic font size based on vw
                      },
                    }}
                  />
                ))}
              </Box>
            </Popover>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
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

                  marginTop: "20%", // Relative to the parent container
                  width: "50%", // Relative to the parent container
                  height: "75%", // Relative to the parent container
                  maxHeight: "12vw",
                  // width: "15vw",
                  // height: "15vw",
                }}
              />
              <div style={{ textAlign: "center", padding: "5%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    fontWeight: "bold",
                    marginTop: "10%",
                    fontSize: "1.8vw",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      marginBottom: "5%",
                      color: "#153363",
                    }}
                  >
                    {profile.title}
                  </div>
                  <div
                    style={{
                      marginLeft: "5px",
                      marginBottom: "5%",
                      color: "#153363",
                    }}
                  >{`${profile.firstName} ${profile.lastName}`}</div>
                </div>

                <div
                  style={{
                    cursor: "pointer",
                    marginBottom: "15%",
                    fontSize: "1.5vw",
                  }}
                >
                  {profile.role}
                </div>
              </div>

              {emailCounts[`${currentUser?.uid}_${profile?.id}`] + 1 <=
                maxEmails && showContactButton[profile.id] !== false ? (
                <IconButton
                  disabled={contactDisabled[profile.id]}
                  onClick={(event) => handleContactClick(event, profile)}
                  className="noHoverEffect"
                  sx={{
                    ":hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                  style={{
                    position: "absolute",
                    top: "5%",
                    right: "5%",

                    cursor: "pointer",
                    fontFamily: "Tensor Sans",
                    color: "black",
                    fontSize: "1.2vw",

                    // Remove any box-shadow or border that might appear on hover
                    "&:hover": {
                      backgroundColor: "transparent",
                      boxShadow: "none",
                      border: "none",
                    },
                  }}
                >
                  Contact{" "}
                  <EmailOutlinedIcon
                    sx={{
                      ":hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                    style={{
                      fontSize: "1.5em",
                      color: "black",
                      marginLeft: "5%",
                      // Remove any box-shadow or border that might appear on hover
                      "&:hover": {
                        backgroundColor: "transparent",
                        boxShadow: "none",
                        border: "none",
                      },
                    }}
                  />
                </IconButton>
              ) : (
                <IconButton
                  sx={{
                    ":focus": {
                      backgroundColor: "transparent",
                      boxShadow: "none",
                    },
                    ":active": {
                      backgroundColor: "transparent",
                      boxShadow: "none",
                    },
                    ":hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                  style={{
                    position: "absolute",
                    top: "5%",
                    right: "5%",
                    marginBottom: "15%",
                    cursor: "pointer",
                    fontFamily: "Tensor Sans",
                    color: "grey",
                    fontSize: "1.2vw",
                    // Remove any box-shadow or border that might appear on hover
                    "&:hover": {
                      backgroundColor: "transparent",
                      boxShadow: "none",
                      border: "none",
                    },
                  }}
                >
                  Contact{" "}
                  <EmailOutlinedIcon
                    sx={{
                      backgroundColor: "transparent",
                      color: "grey",
                      marginLeft: "5px",
                      ":hover": {
                        backgroundColor: "transparent",
                      },
                      ":focus": {
                        backgroundColor: "transparent",
                        boxShadow: "none",
                      },
                      ":active": {
                        backgroundColor: "transparent",
                        boxShadow: "none",
                      },
                    }}
                    style={{
                      fontSize: "1.5em",
                      color: "grey",
                      marginLeft: "5%",
                      // Remove any box-shadow or border that might appear on hover
                      "&:hover": {
                        backgroundColor: "transparent",
                        boxShadow: "none",
                        border: "none",
                      },
                    }}
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
              setShowContactButton={setShowContactButton}
            />
          </Modal>
        )}
      </div>
    </div>
  );
}
