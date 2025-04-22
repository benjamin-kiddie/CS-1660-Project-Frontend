const styles = {
  content: {
    width: { xs: "100%", md: "90%" },
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    gap: "20px",
    alignItems: "flex-start",
    justifyContent: "center",
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
    width: "100%",
    aspectRatio: "16/9",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: "10px",
    backgroundColor: "#000",
  },
  titleUploaderContainer: {
    textAlign: "left",
    width: "100%",
  },
  uploaderLikeContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: "10px",
  },
  uploaderContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
    position: "relative",
  },
  expandCollapse: {
    fontWeight: "bold",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  expandInline: {
    display: "inline",
    marginLeft: "5px",
  },
  collapseBlock: {
    display: "block",
    marginTop: "10px",
  },
  likeDislikeContainer: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  likeButton: {
    display: "flex",
    alignItems: "center",
    color: "#888",
    gap: "4px",
  },
  dislikeButton: {
    display: "flex",
    alignItems: "center",
    color: "#888",
    gap: "4px",
  },
  likeButtonActive: {
    color: "#1976d2",
  },
  dislikeButtonActive: {
    color: "#1976d2",
  },
  thumbIcon: {
    marginRight: "8px",
  },
};

export default styles;
