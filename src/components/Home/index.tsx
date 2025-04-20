import { Grid2 as Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useUser } from "../../hooks/useUser";
import { getVideoOptions } from "../../utils/api";
import { VideoOption } from "../../utils/types";
import VideoOptionTile from "../VideoOptionTile";
import VideoOptionTileSkeleton from "../VideoOptionTileSkeleton";

const styles = {
  grid: {
    width: {
      xs: "100%",
      sm: "97%",
      md: "94%",
      lg: "92",
      xl: "90%",
    },
    height: "100%",
  },
  refetchLayer: {
    marginBottom: "30px",
  },
};

/**
 * Front page component.
 * Shows list of videos.
 */
function Home() {
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [videoList, setVideoList] = useState<VideoOption[]>([]);
  const [hasMoreVideos, setHasMoreVideos] = useState<boolean>(true);
  const videoPageRef = useRef<number>(1);
  const seedRef = useRef<string>(Math.random().toString(36).substring(2));
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchVideoOptions = async () => {
      if (!user || loading) return;
      setLoading(true);
      const token = await user.getIdToken();
      const { videoOptions: newVideoOptions, hasMore } = await getVideoOptions(
        seedRef.current,
        videoPageRef.current,
        15,
        undefined,
        token
      );
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

  useEffect(() => {
    if (!hasMoreVideos && observerInstanceRef.current) {
      observerInstanceRef.current.disconnect();
    }
  }, [hasMoreVideos]);

  return (
    <>
      <Grid container spacing={3} sx={styles.grid}>
        {videoList.map((video) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }} key={video.id}>
            <VideoOptionTile video={video} />
          </Grid>
        ))}
        {loading &&
          Array.from({ length: 15 }).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }} key={index}>
              <VideoOptionTileSkeleton />
            </Grid>
          ))}
      </Grid>
      {!loading && hasMoreVideos && (
        <div ref={observerRef} style={styles.refetchLayer} />
      )}
    </>
  );
}

export default Home;
