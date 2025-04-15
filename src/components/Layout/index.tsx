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
import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import styles from "./styles";
import logo from "../../assets/videoplayer.svg";
import { useUser } from "../../hooks/useUser";
import { auth } from "../../utils/firebase";

/**
 * Layout for main pages, including Home, Profile, and Video.
 */
function Layout() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [search, setSearch] = useState<string>("");
  const [logoutMenuAnchorEl, setLogoutMenuAnchorEl] =
    useState<HTMLElement | null>(null);
  const [sideMenuAnchorEl, setSideMenuAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const sideMenuOpen = Boolean(sideMenuAnchorEl);
  const logoutMenuOpen = Boolean(logoutMenuAnchorEl);
  const [searchBarWidth, setTextFieldWidth] = useState<number>(0);
  const searchBarRef = useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (searchBarRef.current) {
      setTextFieldWidth(searchBarRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (searchBarRef.current) {
        setTextFieldWidth(searchBarRef.current.offsetWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
        setUser(null);
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  }

  /**
   * Handle a navigation in profile page.
   */
  function handleProfile() {
    navigate("/profile");
  }

  /**
   * Handle pressing "Enter" in the search bar.
   * Navigate to /search?query=<contents of the searchbar>.
   */
  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && search.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(search.trim())}`);
      if (searchBarRef.current) {
        const inputElement = searchBarRef.current.querySelector("input");
        if (inputElement) {
          inputElement.blur();
        }
      }
    }
  }

  return (
    <Container maxWidth={false} disableGutters>
      <AppBar position="sticky" sx={styles.appBar} color="default">
        <Toolbar sx={styles.toolbar}>
          <Box
            sx={{
              ...styles.leftContainer,
              marginRight:
                searchBarWidth > 0
                  ? `max(0px, calc(50% - 207px - (0.5 * ${searchBarWidth}px)))`
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
              sx={styles.drawerButton}
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
              <img src={logo} style={styles.logo} />
              <Typography variant="h5" fontWeight={500}>
                ScuffTube
              </Typography>
            </Link>
          </Box>
          <Box sx={styles.searchBarContainer}>
            <TextField
              ref={searchBarRef}
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
              onKeyDown={handleSearchKeyDown}
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
      <Container maxWidth={false} sx={styles.mainContent}>
        <Outlet />
      </Container>
    </Container>
  );
}

export default Layout;
