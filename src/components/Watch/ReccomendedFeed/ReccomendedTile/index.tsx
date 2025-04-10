import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./styles";
import { timeSinceUpload } from "../../../../utils/helpers";
import { VideoOption } from "../../../../utils/types";

type ReccomendedTileProps = {
  video: VideoOption;
};

/**
 * Video option on video sidebar.
 * Shows a video thumbnail, title, author, views, and time since upload.
 */
function ReccomendedTile({ video }: ReccomendedTileProps) {
  return (
    <Box sx={styles.tile}>
      <Box sx={styles.thumbnailContainer}>
        <Link to={`/watch/${video.id}`} style={styles.thumbnailLink}>
          <Box
            component="img"
            src={video.thumbnailSignedLink}
            alt={`${video.title} thumbnail`}
            sx={styles.thumbnail}
          />
        </Link>
      </Box>
      <Box sx={styles.textContainer}>
        <Link to={`/watch/${video.id}`} style={styles.titleLink}>
          <Typography variant="body1" fontWeight={500} sx={styles.title}>
            {video.title}
          </Typography>
        </Link>
        <Typography variant="body2" color="textSecondary">
          {video.uploaderDisplayName}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {video.views} views • {timeSinceUpload(video.uploadTimestamp)}
        </Typography>
      </Box>
    </Box>
  );
}

export default ReccomendedTile;
