import { Grid2 as Grid } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import VideoOptionTile from "./VideoOptionTile";
import VideoOptionTileSkeleton from "./VideoOptionTileSkeleton";
import { useUser } from "../hooks/useUser";
import { getVideoOptions } from "../utils/api";
import { VideoOption } from "../utils/types";

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
    paddingBottom: "24px",
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
  const initialFetchDoneRef = useRef(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);
  const pageSize = 15;

  const fetchVideoOptions = useCallback(async () => {
    if (!user || loading) return;
    setLoading(true);

    const token = await user.getIdToken();
    const { videoOptions: newVideoOptions, hasMore } = await getVideoOptions(
      seedRef.current,
      videoPageRef.current,
      pageSize,
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
  }, [user, loading]);

  useEffect(() => {
    let isCancelled = false;

    const resetAndFetch = async () => {
      if (!user) return;

      setVideoList([]);
      setHasMoreVideos(true);
      videoPageRef.current = 1;
      seedRef.current = Math.random().toString(36).substring(2);
      initialFetchDoneRef.current = false;
      setLoading(true);

      const token = await user.getIdToken();
      const { videoOptions: newVideoOptions, hasMore } = await getVideoOptions(
        seedRef.current,
        videoPageRef.current,
        pageSize,
        undefined,
        token
      );

      if (!isCancelled) {
        setVideoList(newVideoOptions);
        videoPageRef.current += 1;
        setHasMoreVideos(hasMore);
        initialFetchDoneRef.current = true;
        setLoading(false);
      }
    };

    resetAndFetch();
    return () => {
      isCancelled = true;
    };
  }, [user]);

  useEffect(() => {
    const shouldObserve =
      initialFetchDoneRef.current && hasMoreVideos && !loading;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchVideoOptions();
        }
      },
      { threshold: 0.6 }
    );

    const currentObserverRef = observerRef.current;

    if (shouldObserve && currentObserverRef) {
      observer.observe(currentObserverRef);
      observerInstanceRef.current = observer;
    }

    return () => {
      if (observerInstanceRef.current) {
        observerInstanceRef.current.disconnect();
        observerInstanceRef.current = null;
      }
    };
  }, [hasMoreVideos, loading, fetchVideoOptions]);

  return (
    <>
      <Grid container spacing={3} sx={styles.grid}>
        {videoList.map((video, index) => {
          const isLast = index === videoList.length - 1;
          return (
            <Grid
              size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}
              key={video.id}
              ref={isLast && hasMoreVideos ? observerRef : null}
            >
              <VideoOptionTile video={video} />
            </Grid>
          );
        })}
        {loading &&
          Array.from({ length: pageSize }).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }} key={index}>
              <VideoOptionTileSkeleton />
            </Grid>
          ))}
      </Grid>
    </>
  );
}

export default Home;
