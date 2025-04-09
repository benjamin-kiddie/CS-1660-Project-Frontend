import {
  Avatar,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import ReccomendedTile from "./ReccomendedTile";
import styles from "./styles";
import { useUser } from "../../hooks/useUser";
import {
  getVideoDetails,
  getVideoOptions,
  incrementViewCount,
} from "../../utils/api";
import { timeSinceUpload } from "../../utils/helpers";
import { VideoDetails, VideoOption } from "../../utils/types";

// TODO: Implement skeleton when loading
// TODO: Implement comments

function Watch() {
  const { user } = useUser();
  const { videoId } = useParams<{ videoId: string }>();
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [videoList, setVideoList] = useState<VideoOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [descriptionisExpanded, setDescriptionIsExpanded] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      if (!videoId || !user) return;
      const token = await user.getIdToken();
      const newVideoDetails = await getVideoDetails(videoId, token);
      if (newVideoDetails) {
        setVideoDetails(newVideoDetails);
      }
      setLoading(false);
    };

    fetchVideoDetails();
  }, [user, videoId]);

  useEffect(() => {
    const fetchVideoOptions = async () => {
      if (!user) return;
      const token = await user.getIdToken();
      const newVideoList = await getVideoOptions(token);
      if (newVideoList.length > 0) {
        setVideoList(newVideoList);
      }
    };

    fetchVideoOptions();
  }, [user]);

  /**
   * Start playback and increment the view count.
   */
  async function startPlayback() {
    if (!videoId || !user) return;
    setIsPlaying(true);
    const token = await user.getIdToken();
    incrementViewCount(videoId, token);
  }

  return (
    <Box sx={styles.content}>
      <Box sx={styles.videoContentContainer}>
        {loading ? (
          <CircularProgress />
        ) : !videoDetails ? (
          <div>error</div>
        ) : (
          <>
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
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {videoDetails.title}
              </Typography>
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
            </Box>
            <Box sx={styles.descriptionBox}>
              <Typography fontWeight={500}>
                {videoDetails.views} views •{" "}
                {descriptionisExpanded
                  ? new Date(videoDetails.uploadDate).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : timeSinceUpload(videoDetails.uploadDate)}
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
          </>
        )}
      </Box>
      <Box sx={styles.reccomendedContainer}>
        <Stack spacing={2}>
          {videoList
            .filter((video) => video.id != videoId)
            .map((video) => (
              <ReccomendedTile video={video} key={video.id} />
            ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default Watch;
