const styles = {
  content: {
    width: { xs: "100%", md: "90%" },
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    gap: "20px",
    justifyContent: "center",
    alignItems: "stretch",
  },
  videoContentContainer: {
    width: { xs: "100%", md: "75%" },
    minWidth: { xs: "100%", md: "500px" },
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  recommendedContainerSkeleton: {
    height: "100%",
    minWidth: "308px",
    width: { xs: "100%", md: "25%" },
  },
  playerContainer: {
    maxHeight: "600px",
    width: "100%",
    aspectRatio: "16/9",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: "10px",
  },
  titleUploaderContainer: {
    textAlign: "left",
    width: "100%",
  },
  uploaderContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
  },
  avatar: { marginRight: "10px" },
  descriptionSkeleton: {
    width: "100%",
    height: "60px",
    borderRadius: 3,
    marginTop: "10px",
  },
  descriptionBox: {
    width: "100%",
    marginTop: "10px",
    boxSizing: "border-box",
    textAlign: "left",
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    padding: "10px",
  },
  descriptionContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expand: {
    fontWeight: "bold",
    cursor: "pointer",
    marginLeft: "10px",
  },
};

export default styles;
