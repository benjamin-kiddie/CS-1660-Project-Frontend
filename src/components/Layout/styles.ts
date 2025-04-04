const styles = {
  appBar: {
    width: "100%",
  },
  leftContainer: {
    display: "flex",
    alignItems: "center",
    paddingRight: "10px",
  },
  logoAndTitle: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "inherit",
  },
  logo: {
    height: "30px",
    width: "30px",
    marginRight: "5px",
  },
  searchBarContainer: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    width: "100%",
    maxWidth: "500px",
    minWidth: "50px",
    paddingRight: "10px",
  },
  searchBar: {
    borderRadius: "20px",
    width: "100%",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgba(0, 0, 0, 0.23)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(0, 0, 0, 0.5)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "rgba(0, 0, 0, 0.7)",
        borderWidth: "1px",
      },
    },
  },
  avatarContainer: {
    marginLeft: "auto",
    marginRight: 0,
    display: "flex",
    alignItems: "center",
  },
};

export default styles;
