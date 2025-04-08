import { Avatar, Box, Stack, Typography } from "@mui/material";
import { styles } from "./styles";
import { VideoOption } from "../../utils/types";

type VideoOptionTileProps = {
  video: VideoOption;
};

/**
 * Video option on home page and video sidebar.
 * Shows a video thumbnail, title, author, views, and time since upload.
 */
function VideoOptionTile({ video }: VideoOptionTileProps) {
  /**
   * Find the time since upload, rounded to the largest unit of time.
   * @param {string} uploadDate Upload time in UTC format.
   * @returns {string} String showing time since upload.
   */
  function timeSinceUpload(uploadDate: string): string {
    const uploadTime = new Date(uploadDate);
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - uploadTime.getTime()) / 1000
    );

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} months ago`;
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} years ago`;
  }

  return (
    <Box sx={styles.tile}>
      <Box sx={styles.thumbnailContainer}>
        <Box
          component="img"
          src={video.thumbnailSignedLink}
          alt={`${video.title} thumbnail`}
          sx={styles.thumbnail}
        />
      </Box>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          src={video.uploaderPfp}
          alt={`${video.uploaderDisplayName}'s profile picture`}
        />
        <Box>
          <Typography variant="body1" noWrap>
            {video.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" noWrap>
            {video.uploaderDisplayName}{" "}
          </Typography>
          <Typography variant="body2" color="textSecondary" noWrap>
            {video.views} views • {timeSinceUpload(video.uploadDate)}{" "}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default VideoOptionTile;
