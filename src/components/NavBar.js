import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContexts";
import logo from "./assets/logo.png";
import { db } from "../firebase";
import MenuListComposition from "./menuListComponent.js";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function NavItem({ label, link }) {
  return (
    <Link to={link}>
      <Typography
        as="li"
        variant="small"
        className="p-1 font-medium text-black"
      >
        {label}
      </Typography>
    </Link>
  );
}

function NavbarSimple() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const { currentUser, logout } = useAuth();

  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser?.uid) {
        const docRef = doc(db, "profiles", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserProfile();
  }, [currentUser, location.pathname]);

  const handleLogout = async () => {
    try {
      setError("");
      await logout();
      navigate("/signup");
    } catch (error) {
      console.error(error);
      setError("Failed to Log Out.");
    }
  };

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpen(false)
    );
  }, []);

  return (
    <Navbar fullWidth className="bg-hbkuBlue border-none">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex gap-2">
          <Link to="/" exact>
            <img src={logo} alt="logo" className="h-8 lg:h-12 cursor-pointer" />
          </Link>
          <div className="hidden lg:block">
            <ul className="mb-4 mt-2 flex flex-col gap-3 lg:mb-0 lg:mt-2 lg:flex-row lg:items-center lg:gap-8">
              <NavItem label="Home" link="/" />
              {userProfile && userProfile.accountRole === "admin" && (
                <NavItem label="Add Material" link="/NewMaterial" />
              )}
              <NavItem label="Search" link="/SearchResults" />
              {currentUser &&
                userProfile &&
                userProfile.role &&
                userProfile.firstName &&
                userProfile.lastName && (
                  <NavItem label="Members" link="/Researchers" />
                )}
            </ul>
          </div>
        </div>
        <div className="lg:flex hidden items-center gap-2">
          {currentUser ? (
            <>
              {userProfile ? (
                <>
                  <img
                    src={
                      userProfile.profileImage ||
                      require("../components/assets/profile-photo.webp")
                    }
                    alt="Profile"
                    style={{
                      width: "40px",
                      height: "40px",
                      border: "1px solid #5c5b5b",
                      boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.3)",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                  />
                  <span style={{ marginRight: "10px" }}>
                    {userProfile.title} {userProfile.firstName}{" "}
                    {userProfile.lastName}
                  </span>
                  <MenuListComposition logout={logout} navigate={navigate} />{" "}
                </>
              ) : (
                <Typography
                  onClick={handleLogout}
                  style={{ cursor: "pointer", marginRight: "10px" }}
                >
                  Log Out
                </Typography>
              )}
            </>
          ) : (
            <Link
              to="/Signup"
              className="nav-link"
              style={{ marginRight: "10px" }}
            >
              Sign In
            </Link>
          )}
        </div>
        <IconButton
          size="sm"
          variant="text"
          color="gray"
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden"
        >
          {open ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={open}>
        <ul
          className="mb-4 mt-2 flex flex-col gap-3 lg:mb-0 lg:mt-2 lg:flex-row lg:items-center lg:gap-8"
          onClick={handleOpen}
        >
          <NavItem label="Home" link="/" />
          {userProfile && userProfile.accountRole === "admin" && (
            <NavItem label="Add Material" link="/NewMaterial" />
          )}
          <NavItem label="Search" link="/SearchResults" />
          {currentUser &&
            userProfile &&
            userProfile.role &&
            userProfile.firstName &&
            userProfile.lastName && (
              <NavItem label="Members" link="/Researchers" />
            )}
        </ul>

        {currentUser ? (
          <>
            {userProfile ? (
              <>
                <img
                  src={
                    userProfile.profileImage ||
                    require("../components/assets/profile-photo.webp")
                  }
                  alt="Profile"
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "1px solid #5c5b5b",
                    boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.3)",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <span style={{ marginRight: "10px" }}>
                  {userProfile.title} {userProfile.firstName}{" "}
                  {userProfile.lastName}
                </span>
                <MenuListComposition logout={logout} navigate={navigate} />{" "}
              </>
            ) : (
              <Typography
                onClick={handleLogout}
                style={{ cursor: "pointer", marginRight: "10px" }}
              >
                Log Out
              </Typography>
            )}
          </>
        ) : (
          <Link
            to="/Signup"
            className="nav-link"
            style={{ marginRight: "10px" }}
          >
            Sign In
          </Link>
        )}
      </Collapse>
    </Navbar>
  );
}

export default NavbarSimple;
