const styles = {
  tile: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  thumbnailLink: { textDecoration: "none" },
  thumbnailContainer: {
    position: "relative",
    width: "100%",
    paddingTop: "56.25%",
    backgroundColor: "gray",
    overflow: "hidden",
    borderRadius: 3,
    marginBottom: "4px",
  },
  thumbnail: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  textContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  titleLink: { textDecoration: "none", color: "inherit" },
  title: {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1.2,
    marginBottom: "5px",
  },
  menuButton: { padding: "0 0 0 5px" },
};

export default styles;
