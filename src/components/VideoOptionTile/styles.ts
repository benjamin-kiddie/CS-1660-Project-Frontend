export const styles = {
  tile: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  thumbnailContainer: {
    position: "relative",
    width: "100%",
    paddingTop: "56.25%",
    backgroundColor: "gray",
    overflow: "hidden",
    borderRadius: 3,
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
};
