import { Box, Grid2 as Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { searchVideoOptions } from "../../utils/api";
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
      xl: "90%%",
    },
    height: "100%",
    paddingBottom: "24px",
  },
  noResults: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },
  refetchLayer: {
    marginBottom: "30px",
  },
};

/**
 * Display a list of videos to the user.
 * If the user scrolls down far enough and more videos are available, show more.
 */
function Search() {
  const { user } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [videoList, setVideoList] = useState<VideoOption[]>([]);
  const [hasMoreVideos, setHasMoreVideos] = useState<boolean>(true);
  const videoPageRef = useRef<number>(1);
  const initialFetchDoneRef = useRef(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const pageSize = 15;

  const fetchVideoOptions = useCallback(async () => {
    if (!user || loading) return;
    setLoading(true);
    const token = await user.getIdToken();

    const { videoOptions: newVideoOptions, hasMore } = await searchVideoOptions(
      query,
      videoPageRef.current,
      pageSize,
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
  }, [user, loading, query]);

  useEffect(() => {
    let isCancelled = false;

    const resetAndFetch = async () => {
      if (!user) return;

      setVideoList([]);
      setHasMoreVideos(true);
      videoPageRef.current = 1;
      initialFetchDoneRef.current = false;
      setLoading(true);

      const token = await user.getIdToken();
      const { videoOptions: newVideoOptions, hasMore } =
        await searchVideoOptions(query, videoPageRef.current, pageSize, token);

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
  }, [query, user]);

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
      {(videoList.length > 0 || loading) && (
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
      )}
      {!loading && videoList.length === 0 && (
        <Box style={styles.noResults}>
          <Typography variant="h4" color="textSecondary">
            No results found.
          </Typography>
        </Box>
      )}
    </>
  );
}

export default Search;
