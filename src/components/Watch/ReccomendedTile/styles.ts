const styles = {
  tile: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    padding: "0 0 10px",
  },
  thumbnailContainer: {
    flexShrink: 0,
    width: "160px",
    height: "90px",
    overflow: "hidden",
    borderRadius: "4px",
  },
  thumbnail: {
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
  title: {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1.2,
    marginBottom: "5px",
  },
};

export default styles;
