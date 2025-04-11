import { Box, Stack, Skeleton } from "@mui/material";
import styles from "./styles";

/**
 * Skeleton of a video option on home page and profile page.
 */
function VideoOptionTileSkeleton() {
  return (
    <Box sx={styles.tile}>
      <Box sx={styles.thumbnailContainer}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={styles.thumbnailSkeleton}
        />
      </Box>
      <Stack direction="row" alignItems="top" spacing={2}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box sx={styles.textContainer}>
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="50%" height={20} />
        </Box>
      </Stack>
    </Box>
  );
}

export default VideoOptionTileSkeleton;
