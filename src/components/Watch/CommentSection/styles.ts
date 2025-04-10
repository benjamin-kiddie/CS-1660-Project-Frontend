const styles = {
  commentsSectionContainer: {
    width: "100%",
    marginTop: "10px",
    boxSizing: "border-box",
    textAlign: "left",
  },
  commentFieldContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "8px",
    alignItems: "center",
    margin: "10px 0 10px",
    width: "100%",
  },
  commentField: {
    width: "100%",
  },
  cancelButton: {
    color: "text.secondary",
  },
  commentsList: {
    marginTop: "30px",
    marginBottom: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  comment: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    alignItems: "start",
    position: "relative",
  },
  avatar: {
    marginTop: "5px",
  },
  commentHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "4px",
  },
  commentMenuButton: {
    position: "absolute",
    top: "8px",
    right: "8px",
  },
  refetchLayer: {
    marginBottom: "30px",
  },
};

export default styles;
