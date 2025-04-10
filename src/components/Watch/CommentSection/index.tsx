import {
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import styles from "./styles";
import { useUser } from "../../../hooks/useUser";
import { deleteComment, getComments, postComment } from "../../../utils/api";
import { timeSinceUpload } from "../../../utils/helpers";
import { CommentDetails } from "../../../utils/types";

type CommentSectionProps = {
  numComments: number;
  currentVideoId?: string;
};

function CommentSection({ numComments, currentVideoId }: CommentSectionProps) {
  const { user } = useUser();
  const [comment, setComment] = useState<string>("");
  const [showCommentButtons, setShowCommentButtons] = useState<boolean>(false);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(true);
  const [comments, setComments] = useState<CommentDetails[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
    null
  );
  const lastCommentIdRef = useRef<string | undefined>(undefined);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      if (!currentVideoId || !user || loadingComments) return;
      setLoadingComments(true);
      const token = await user.getIdToken();
      const { comments: newComments, hasMore } = await getComments(
        currentVideoId,
        lastCommentIdRef.current,
        token
      );
      if (newComments.length > 0) {
        setComments((prevComments) => [...prevComments, ...newComments]);
        lastCommentIdRef.current = newComments[newComments.length - 1].id;
        if (!hasMore) {
          setHasMoreComments(false);
        }
      }
      setLoadingComments(false);
    };

    if (hasMoreComments) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loadingComments) {
            fetchComments();
          }
        },
        { threshold: 1.0 }
      );

      const currentObserverRef = observerRef.current;
      if (currentObserverRef) {
        observer.observe(currentObserverRef);
      }

      return () => {
        if (currentObserverRef) {
          observer.unobserve(currentObserverRef);
        }
      };
    }
  }, [
    user,
    currentVideoId,
    lastCommentIdRef,
    hasMoreComments,
    loadingComments,
  ]);

  /**
   * Empty the comment field and hide the comment buttons.
   */
  function emptyCommentField() {
    setComment("");
    setShowCommentButtons(false);
  }

  /**
   * Handle posting a new comment.
   * Append the new comment to the comment list.
   */
  async function handlePostComment() {
    if (!currentVideoId || !user) return;
    const token = await user.getIdToken();
    const newComment = await postComment(
      currentVideoId,
      comment,
      user?.uid,
      token
    );
    if (newComment) {
      setComments((prevComments) => [newComment, ...prevComments]);
      emptyCommentField();
    }
  }

  /**
   * Open the dropdown menu for a comment.
   */
  function handleMenuOpen(
    event: React.MouseEvent<HTMLElement>,
    commentId: string
  ) {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
  }

  /**
   * Close the dropdown menu for a comment.
   */
  function handleMenuClose() {
    setAnchorEl(null);
    setSelectedCommentId(null);
  }

  /**
   * Handle deleting a comment.
   * Delete the comment from the comment list.
   */
  async function handleDeleteComment() {
    if (!currentVideoId || !selectedCommentId || !user) return;
    const token = await user.getIdToken();
    const success = await deleteComment(
      currentVideoId,
      selectedCommentId,
      token
    );
    if (success) {
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== selectedCommentId)
      );
    }
    handleMenuClose();
  }

  return (
    <Box sx={styles.commentsSectionContainer}>
      <Typography
        variant="h6"
        fontWeight={500}
      >{`${numComments} Comments`}</Typography>
      <Box sx={styles.commentFieldContainer}>
        <Avatar
          src={user?.photoURL || ""}
          alt={user?.displayName || ""}
          sx={styles.avatar}
        />
        <TextField
          variant="standard"
          value={comment}
          placeholder="Add a comment..."
          autoComplete="off"
          multiline
          maxRows={7}
          onFocus={() => setShowCommentButtons(true)}
          onChange={(e) => setComment(e.target.value)}
          sx={styles.commentField}
        />
        {showCommentButtons && (
          <>
            <Button
              variant="outlined"
              onClick={emptyCommentField}
              sx={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={!comment.trim()}
              onClick={handlePostComment}
            >
              Comment
            </Button>
          </>
        )}
      </Box>
      <Box sx={styles.commentsList}>
        {comments.map((comment) => (
          <Box key={comment.id} sx={styles.comment}>
            <Avatar
              src={comment.commenterPfp || ""}
              alt={comment.commenterDisplayName}
              sx={styles.avatar}
            />
            <Stack width="100%">
              <Box sx={styles.commentHeader}>
                <Typography fontWeight={500}>
                  {comment.commenterDisplayName}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {timeSinceUpload(comment.commentTimestamp)}
                </Typography>
                {comment.commenterId === user?.uid && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, comment.id)}
                    sx={styles.commentMenuButton}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Typography width="95%">{comment.comment}</Typography>
            </Stack>
          </Box>
        ))}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleDeleteComment}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </MenuItem>
        </Menu>
        {loadingComments && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {hasMoreComments && (
          <div ref={observerRef} style={styles.refetchLayer} />
        )}
      </Box>
    </Box>
  );
}

export default CommentSection;
