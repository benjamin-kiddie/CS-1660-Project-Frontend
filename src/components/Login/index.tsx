import GoogleIcon from "@mui/icons-material/Google";
import { Box, Button, Typography } from "@mui/material";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "./styles";
import { useUser } from "../../hooks/useUser";
import { auth } from "../../utils/firebase";

/**
 * Login form. Uses Google's OAuth provider.
 */
function Login() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  /**
   * Handle logging users in through Google OAuth.
   */
  async function handleGoogleLogin() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate("/home");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Login error:", error.message);
      } else {
        console.error("An unknown error occured.");
      }
    }
  }

  return (
    <Box sx={styles.loginContainer}>
      <Box sx={styles.loginBox}>
        <img src="videoplayer.svg" style={styles.logo} />
        <Typography variant="h3" color="#1D1D1B" fontWeight={500}>
          Login to ScuffTube
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleGoogleLogin}
          startIcon={<GoogleIcon />}
          sx={styles.loginButton}
        >
          Login with Google
        </Button>
      </Box>
    </Box>
  );
}

export default Login;
