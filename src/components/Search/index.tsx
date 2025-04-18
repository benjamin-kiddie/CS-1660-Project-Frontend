import { Box, Grid2 as Grid, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
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
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  useEffect(() => {
    const fetchVideoOptions = async () => {
      if (!user || loading) return;
      setLoading(true);
      const token = await user.getIdToken();

      const { videoOptions: newVideoOptions, hasMore } =
        await searchVideoOptions(query, videoPageRef.current, 15, token);

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
  }, [hasMoreVideos, loading, user, query]);

  useEffect(() => {
    setVideoList([]);
    videoPageRef.current = 1;
    setHasMoreVideos(true);
  }, [query]);

  useEffect(() => {
    if (!hasMoreVideos && observerInstanceRef.current) {
      observerInstanceRef.current.disconnect();
    }
  }, [hasMoreVideos]);

  return (
    <>
      {(videoList.length > 0 || loading) && (
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
            Array.from({ length: 15 }).map((_, index) => (
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
      {!loading && hasMoreVideos && (
        <div ref={observerRef} style={styles.refetchLayer} />
      )}
    </>
  );
}

export default Search;
