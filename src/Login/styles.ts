const styles = {
  loginContainer: {
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  loginBox: {
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    width: "450px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    height: "100px",
    width: "100px",
    marginBottom: "10px",
  },
  loginButton: {
    marginTop: "20px",
    backgroundColor: "#4285F4",
    "&:hover": {
      backgroundColor: "#357AE8",
    },
    color: "white",
  },
};

export default styles;
