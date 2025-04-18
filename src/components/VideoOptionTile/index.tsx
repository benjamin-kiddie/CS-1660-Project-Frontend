import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "./styles";
import { timeSinceUpload } from "../../utils/helpers";
import { VideoOption } from "../../utils/types";

type VideoOptionTileProps = {
  video: VideoOption;
  showMenu?: boolean;
  openMenu?: (event: React.MouseEvent<HTMLElement>, videoId: string) => void;
};

/**
 * Video option on home page and profile page.
 * Shows a video thumbnail, title, author, views, and time since upload.
 */
function VideoOptionTile({ video, showMenu, openMenu }: VideoOptionTileProps) {
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
      <Stack direction="row" alignItems="top" spacing={1}>
        <Avatar
          src={video.uploaderPfp}
          alt={`${video.uploaderDisplayName}'s profile picture`}
        />
        <Box sx={styles.textContainer}>
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Link to={`/watch/${video.id}`} style={styles.titleLink}>
              <Typography variant="body1" fontWeight={500} sx={styles.title}>
                {video.title}
              </Typography>
            </Link>
            {showMenu && openMenu && (
              <IconButton
                onClick={(e) => openMenu(e, video.id)}
                size="small"
                sx={styles.menuButton}
              >
                <MoreVertIcon />
              </IconButton>
            )}
          </Stack>
          <Typography variant="body2" color="textSecondary" noWrap>
            {video.uploaderDisplayName}{" "}
          </Typography>
          <Typography variant="body2" color="textSecondary" noWrap>
            {video.views} views • {timeSinceUpload(video.uploadTimestamp)}{" "}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default VideoOptionTile;
