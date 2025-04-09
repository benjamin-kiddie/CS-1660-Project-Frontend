import { Avatar, Box, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./styles";
import { timeSinceUpload } from "../../utils/helpers";
import { VideoOption } from "../../utils/types";

type VideoOptionTileProps = {
  video: VideoOption;
};

/**
 * Video option on home page and profile page.
 * Shows a video thumbnail, title, author, views, and time since upload.
 */
function VideoOptionTile({ video }: VideoOptionTileProps) {
  return (
    <Box sx={styles.tile}>
      <Box sx={styles.thumbnailContainer}>
        <Link to={`/watch/${video.id}`} style={{ textDecoration: "none" }}>
          <Box
            component="img"
            src={video.thumbnailSignedLink}
            alt={`${video.title} thumbnail`}
            sx={styles.thumbnail}
          />
        </Link>
      </Box>
      <Stack direction="row" alignItems="top" spacing={2}>
        <Avatar
          src={video.uploaderPfp}
          alt={`${video.uploaderDisplayName}'s profile picture`}
        />
        <Box sx={styles.textContainer}>
          <Link
            to={`/watch/${video.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography variant="body1" fontWeight={500} sx={styles.title}>
              {video.title}
            </Typography>
          </Link>
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
