import { Box, Stack, Skeleton, Typography } from "@mui/material";
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
      <Stack direction="row" alignItems="top" spacing={1}>
        <Skeleton variant="circular" width={40} height={40} />
        <Box sx={styles.textContainer}>
          <Typography variant="body1" fontWeight={500}>
            <Skeleton width="80%" />
          </Typography>
          <Typography variant="body2">
            <Skeleton width="60%" />
          </Typography>
          <Typography variant="body2">
            <Skeleton width="50%" />
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default VideoOptionTileSkeleton;
