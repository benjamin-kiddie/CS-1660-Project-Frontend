import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import styles from "./styles";
import { useUser } from "../../../hooks/useUser";
import { getComments, postComment } from "../../../utils/api";
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
            <Stack>
              <Box sx={styles.commentHeader}>
                <Typography fontWeight={500}>
                  {comment.commenterDisplayName}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {timeSinceUpload(comment.commentTimestamp)}
                </Typography>
              </Box>
              <Typography>{comment.comment}</Typography>
            </Stack>
          </Box>
        ))}
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
