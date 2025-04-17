import { Avatar, Box, Grid2 as Grid, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import styles from "./styles";
import UploadForm from "./UploadForm";
import { useUser } from "../../hooks/useUser";
import { getUserVideoOptions } from "../../utils/api";
import { VideoOption } from "../../utils/types";
import VideoOptionTile from "../VideoOptionTile/index";
import VideoOptionTileSkeleton from "../VideoOptionTileSkeleton";

/**
 * Profile page component.
 * Displays a user's uploaded videos, ordered by upload timestamp.
 */
function Profile() {
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [videoList, setVideoList] = useState<VideoOption[]>([]);
  const [hasMoreVideos, setHasMoreVideos] = useState<boolean>(true);
  const videoPageRef = useRef<number>(1);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchVideoOptions = async () => {
      if (!user || loading) return;
      setLoading(true);
      console.log("looking up");
      const token = await user?.getIdToken();
      const { videoOptions: newVideoOptions, hasMore } =
        await getUserVideoOptions(user.uid, videoPageRef.current, 1, token);
      if (newVideoOptions.length > 0) {
        setVideoList((prevVideoList) => [...prevVideoList, ...newVideoOptions]);
        videoPageRef.current += 1;
      }
      if (!hasMore) {
        setHasMoreVideos(false);
      }
      setLoading(false);
    };

    if (hasMoreVideos) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loading) {
            fetchVideoOptions();
          }
        },
        { threshold: 1.0 }
      );

      const currentObserverRef = observerRef.current;
      if (currentObserverRef) {
        observer.observe(currentObserverRef);
      }

      observerInstanceRef.current = observer;

      return () => {
        if (currentObserverRef) {
          observer.unobserve(currentObserverRef);
        }
        observer.disconnect();
      };
    }
  }, [hasMoreVideos, loading, user]);

  return (
    user && (
      <Box sx={styles.page}>
        <Box sx={styles.banner}>
          <Avatar
            alt={user.displayName || "User"}
            src={user.photoURL || "/default-avatar.png"}
            sx={styles.avatar}
          />
          <Box>
            <Typography variant="h3" fontWeight="bold">
              {user.displayName}
            </Typography>
            <UploadForm />
          </Box>
        </Box>
        <Box>
          <Typography
            variant="h5"
            fontWeight={500}
            color="text.primary"
            sx={styles.uploadedVideos}
          >
            Uploaded Videos
          </Typography>
          <Grid container spacing={3} sx={styles.grid}>
            {videoList.map((video) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}
                key={video.id}
              >
                <VideoOptionTile video={video} />
              </Grid>
            ))}
            {loading &&
              Array.from({ length: 5 }).map((_, index) => (
                <Grid
                  size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}
                  key={index}
                >
                  <VideoOptionTileSkeleton />
                </Grid>
              ))}
          </Grid>
        </Box>
        {!loading && hasMoreVideos && (
          <div ref={observerRef} style={styles.refetchLayer} />
        )}
      </Box>
    )
  );
}

export default Profile;
