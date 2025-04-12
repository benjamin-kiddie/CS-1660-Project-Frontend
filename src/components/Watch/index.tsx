import {
  Avatar,
  Box,
  Button,
  Skeleton,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material"
import { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import CommentSection from "./CommentSection";
import RecommendedFeed from "./RecommendedFeed";
import styles from "./styles";
import { useUser } from "../../hooks/useUser";
import { getVideoDetails, incrementViewCount, toggleReaction } from "../../utils/api";
import { timeSinceUpload } from "../../utils/helpers";
import { VideoDetails } from "../../utils/types";

/**
 * Watch page for a video.
 * Contains player, info, comments section, and recommended videos feed.
 */
function Watch() {
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useUser();
  const { videoId } = useParams<{ videoId: string }>();
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [descriptionisExpanded, setDescriptionIsExpanded] =
    useState<boolean>(false);

  const fetchVideoDetails = useCallback(async () => {
    if (!videoId || !user) return;
    const token = await user.getIdToken();
    const newVideoDetails = await getVideoDetails(videoId, token);
    if (newVideoDetails) {
      setVideoDetails(newVideoDetails);
    }
    setLoading(false);
  }, [videoId, user]);

  useEffect(() => {
    fetchVideoDetails();
  }, [fetchVideoDetails, user, videoId]);

  /**
   * Retry fetching video details if the old fetch failed.
   */
  function retryFetch() {
    setLoading(true);
    fetchVideoDetails();
  }

  /**
   * Start playback and increment the view count.
   */
  async function startPlayback() {
    if (!videoDetails || !user) return;
    setIsPlaying(true);
    const token = await user.getIdToken();
    incrementViewCount(videoDetails.id, token);
  }

  /**
   * Handle user adding like/dislike to video
   */
  async function handleLikeDislike(type: "like" | "dislike") {
    if (!videoId || !user || !videoDetails) return;
    
    const token = await user.getIdToken();
    const status = videoDetails.userLikeStatus;
  
    setVideoDetails(prev => {
      if (!prev) return prev;
      
      const newVideoDetails = {...prev};
      
      if (status === type) {
        newVideoDetails.userLikeStatus = null;
        newVideoDetails[type === 'like' ? 'likes' : 'dislikes'] -= 1;
      } else {
        if (status) {
          newVideoDetails[status === 'like' ? 'likes' : 'dislikes'] -= 1;
        }
        newVideoDetails.userLikeStatus = type;
        newVideoDetails[type === 'like' ? 'likes' : 'dislikes'] += 1;
      }
      
      return newVideoDetails;
    });
  
    await toggleReaction(videoId, type, token);
  } 

  return (
    <Box sx={styles.content}>
      {loading ? (
        <>
          <Box sx={styles.videoContentContainer}>
            <Box sx={styles.playerContainer}>
              <Skeleton variant="rectangular" width="100%" height="100%" />
            </Box>
            <Box sx={styles.titleUploaderContainer}>
              <Skeleton variant="text" width="60%" height={40} />
              <Box sx={styles.uploaderContainer}>
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={styles.avatar}
                />
                <Skeleton variant="text" width="30%" height={30} />
              </Box>
            </Box>
            <Skeleton variant="rectangular" sx={styles.descriptionSkeleton} />
          </Box>
          <Box sx={styles.recommendedContainerSkeleton} />
        </>
      ) : !videoDetails ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography color="text.primary" variant="h6">
            Something went wrong fetching video details.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={retryFetch}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={styles.videoContentContainer}>
            <Box sx={styles.playerContainer}>
              <ReactPlayer
                url={videoDetails.videoSignedUrl}
                controls={true}
                config={{
                  file: {
                    attributes: {
                      controlsList: "nodownload",
                    },
                  },
                }}
                playing={isPlaying}
                stopOnUnmount={true}
                onReady={startPlayback}
                width="100%"
                height="100%"
              />
            </Box>
            <Box sx={styles.titleUploaderContainer}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                {videoDetails.title}
              </Typography>
              <Box sx={styles.uploaderLikeContainer}>
                <Box sx={styles.uploaderContainer}>
                  <Avatar
                    src={videoDetails.uploaderPfp}
                    alt={videoDetails.uploaderDisplayName}
                    sx={styles.avatar}
                  />
                  <Typography fontSize={17} fontWeight={500}>
                    {videoDetails.uploaderDisplayName}
                  </Typography>
                </Box>
                <Box sx={styles.likeDislikeContainer}>
                  <IconButton
                    onClick={() => handleLikeDislike("like")}
                    sx={[
                      styles.likeButton,
                      videoDetails.userLikeStatus === "like" && styles.likeButtonActive,
                    ]}
                  >
                    <ThumbUp />
                    <Typography>{videoDetails.likes}</Typography>
                  </IconButton>
                  <IconButton
                    onClick={() => handleLikeDislike("dislike")}
                    sx={[
                      styles.dislikeButton,
                      videoDetails.userLikeStatus === "dislike" && styles.dislikeButtonActive,
                    ]}
                  >
                    <ThumbDown />
                    <Typography>{videoDetails.dislikes}</Typography>
                  </IconButton>
                </Box>
              </Box>
            </Box>
            <Box sx={styles.descriptionBox}>
              <Typography fontWeight={500}>
                {videoDetails.views} views •{" "}
                {descriptionisExpanded
                  ? new Date(videoDetails.uploadTimestamp).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : timeSinceUpload(videoDetails.uploadTimestamp)}
              </Typography>
              <Box sx={styles.descriptionContainer}>
                <Typography>
                  {descriptionisExpanded
                    ? videoDetails.description
                    : videoDetails.description.length > 200
                    ? `${videoDetails.description.substring(0, 200)}...`
                    : videoDetails.description}
                </Typography>
                <Typography
                  onClick={() =>
                    setDescriptionIsExpanded(!descriptionisExpanded)
                  }
                  sx={styles.expand}
                >
                  {descriptionisExpanded ? "Collapse" : "Expand"}
                </Typography>
              </Box>
            </Box>
            {!isBelowMd && (
              <CommentSection
                numComments={videoDetails.numComments}
                currentVideoId={videoDetails.id}
              />
            )}
          </Box>
          <RecommendedFeed currentVideoId={videoDetails.id} />
          {isBelowMd && (
            <CommentSection
              numComments={videoDetails.numComments}
              currentVideoId={videoDetails.id}
            />
          )}
        </>
      )}
    </Box>
  );
}

export default Watch;
