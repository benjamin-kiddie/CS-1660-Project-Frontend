import { Box, Button, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import styles from "./styles";

function Login() {
  function handleGoogleLogin() {
    console.log("attempted login");
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
