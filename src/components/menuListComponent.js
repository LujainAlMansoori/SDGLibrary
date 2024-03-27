import * as React from "react";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import ArrowDownIcon from "@mui/icons-material/ArrowDropDown";
import Modal from "@mui/material/Modal";

export default function MenuListComposition({ logout, navigate }) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab" || event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };
  const handleClose = (event) => {
    if (
      event &&
      anchorRef.current &&
      anchorRef.current.contains(event.target)
    ) {
      return;
    }
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signup");
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div>
      <Button
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? "composition-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        sx={{
          minWidth: 0, // Remove padding
          padding: 0, // Remove padding
          marginRight: { xs: 1, sm: 2 },
          "&:hover": {
            bgcolor: "transparent", // Remove hover background color
          },
          "&:focus": {
            outline: "none", // Remove focus outline
          },
        }}
      >
        <ArrowDownIcon
          style={{
            color: "black",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3rem" },
          }}
        />
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        style={{
          zIndex: 2000,
          width: "auto",
          maxHeight: "calc(60vh + 20px)",
          overflow: "auto",
        }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                  sx={{
                    "& .MuiMenuItem-root": {
                      fontSize: "calc(0.8rem + 0.5vw)", // Responsive font size based on viewport width
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/editProfile");
                      handleClose();
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleClose}>Settings</MenuItem>
                  <MenuItem
                    onClick={(event) => {
                      handleLogout();
                      handleClose(event);
                    }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}
