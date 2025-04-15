const styles = {
  tile: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  thumbnailContainer: {
    position: "relative",
    width: "100%",
    paddingTop: "56.25%",
    overflow: "hidden",
    borderRadius: 3,
    marginBottom: "4px",
  },
  thumbnailSkeleton: {
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
  titleSkeleton: {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    marginBottom: "5px",
  },
};

export default styles;
