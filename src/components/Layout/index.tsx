import {
  Search as SearchIcon,
  Logout as LogoutIcon,
  AccountCircle as ProfileIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { signOut } from "firebase/auth";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles";
import { useUser } from "../../hooks/useUser";
import { auth } from "../../utils/firebase";

type LayoutProps = {
  children?: ReactNode;
};

// TODO: Implement search

/**
 * Layout for main pages, including Home, Profile, and Video.
 */
function Layout({ children }: LayoutProps) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");
  const [textFieldWidth, setTextFieldWidth] = useState<number>(0);
  const textFieldRef = useRef<HTMLInputElement>(null);
  const [logoutMenuAnchorEl, setLogoutMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [sideMenuAnchorEl, setSideMenuAnchorEl] = useState<HTMLElement | null>(null);
  const sideMenuOpen = Boolean(sideMenuAnchorEl);
  const logoutMenuOpen = Boolean(logoutMenuAnchorEl);

  /**
   * Open the logout menu.
   * @param {React.MouseEvent<HTMLElement>} event user click event.
   */
  function handleLogoutMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setLogoutMenuAnchorEl(event.currentTarget);
  }

  /**
   * Open the side menu.
   * @param {React.MouseEvent<HTMLElement>} event user click event.
   */
   function handleSideMenuOpen(event: React.MouseEvent<HTMLElement>) {  
    setSideMenuAnchorEl(event.currentTarget);
  }

  /**
   * Close the logout menu.
   */
   function handleLogoutMenuClose() {
    setLogoutMenuAnchorEl(null);
  }

  /**
   * Close the side menu.
   */
  function handleSideMenuClose() {
    setSideMenuAnchorEl(null);
  }

  /**
   * Handle a user logging out.
   */
  function handleLogout() {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  }

  /**
   * Handle a navigation in profile page.
   */
  function handleProfile() {
    navigate("/profile")
  }

  /**
   * Manually push the searchbar into the center of the app bar.
   * Update the requisite margin whenever the window resizes.
   */
  useEffect(() => {
    if (textFieldRef.current) {
      setTextFieldWidth(textFieldRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (textFieldRef.current) {
        setTextFieldWidth(textFieldRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Container maxWidth={false} disableGutters>
      <AppBar position="sticky" sx={styles.appBar} color="default">
        <Toolbar sx={styles.toolbar}>
          <Box
            sx={{
              ...styles.leftContainer,
              marginRight:
                textFieldWidth > 0
                  ? `max(0px, calc(50% - 226px - (0.5 * ${textFieldWidth}px)))`
                  : "0px",
            }}
          >
            <IconButton
              onClick={handleSideMenuOpen}
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              aria-controls={sideMenuOpen ? "side-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={sideMenuOpen ? "true" : undefined}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
                id="side-menu"
                anchorEl={sideMenuAnchorEl}
                open={sideMenuOpen}
                onClose={handleSideMenuClose}
                onClick={handleSideMenuClose}
                slotProps={{
                  paper: {
                    elevation: 3,
                    sx: styles.sideMenu,
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleProfile}>
                  <ListItemIcon>
                    <ProfileIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </MenuItem>
              </Menu>
            <Link to="/home" style={styles.logoAndTitle}>
              <img src="videoplayer.svg" style={styles.logo} />
              <Typography variant="h5">ScuffTube</Typography>
            </Link>
          </Box>
          <Box sx={styles.searchBarContainer}>
            <TextField
              ref={textFieldRef}
              variant="outlined"
              size="small"
              placeholder="Search..."
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: styles.searchBar,
                },
              }}
              sx={styles.searchBar}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Box>
          {user && (
            <>
              <IconButton
                onClick={handleLogoutMenuOpen}
                size="small"
                aria-controls={logoutMenuOpen ? "avatar-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={logoutMenuOpen ? "true" : undefined}
                sx={styles.avatarContainer}
              >
                <Avatar
                  alt={user.displayName || "User"}
                  src={user.photoURL || "/default-avatar.png"}
                />
              </IconButton>
              <Menu
                id="avatar-menu"
                anchorEl={logoutMenuAnchorEl}
                open={logoutMenuOpen}
                onClose={handleLogoutMenuClose}
                onClick={handleLogoutMenuClose}
                slotProps={{
                  paper: {
                    elevation: 3,
                    sx: styles.logoutMenu,
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleProfile}>
                  <ListItemIcon>
                    <ProfileIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container color="secondary" sx={styles.mainContent}>
        {children && children}
      </Container>
    </Container>
  );
}

export default Layout;
