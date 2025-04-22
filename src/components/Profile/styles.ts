const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    width: {
      xs: "100%",
      sm: "97%",
      md: "94%",
      lg: "92%",
      xl: "90%",
    },
    height: "100%",
    paddingBottom: "24px",
  },
  banner: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "20%",
    justifyContent: "center",
    alignItems: "center",
    pb: 2,
    mb: 2,
    borderBottom: "1px solid lightgrey",
  },
  avatar: {
    width: "150px",
    height: "150px",
    mr: 2,
  },
  uploadedVideos: {
    mb: 2,
    textAlign: { xs: "center", sm: "left" },
  },
  grid: {
    width: "100%",
    height: "100%",
  },
};

export default styles;
