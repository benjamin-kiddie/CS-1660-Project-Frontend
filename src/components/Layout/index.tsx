import { Search as SearchIcon } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles";
import { useUser } from "../../hooks/useUser";

type LayoutProps = {
  children?: { children: ReactNode };
};

/**
 * Layout for main pages, including Home, Profile, and Video.
 */
function Layout({ children }: LayoutProps) {
  const { user } = useUser();
  const [search, setSearch] = useState<string>("");
  const [textFieldWidth, setTextFieldWidth] = useState<number>(0);
  const textFieldRef = useRef<HTMLInputElement>(null);

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
      <AppBar position="sticky" sx={styles.appBar}>
        <Toolbar
          sx={{
            alignItems: "center",
          }}
        >
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
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
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
            <Box sx={styles.avatarContainer}>
              <Avatar
                alt={user.displayName || "User"}
                src={user.photoURL || "/default-avatar.png"}
                sx={{ width: 40, height: 40 }}
              />
            </Box>
          )}
        </Toolbar>
        {children && children.children}
      </AppBar>
    </Container>
  );
}

export default Layout;
