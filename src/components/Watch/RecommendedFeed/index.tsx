import {
  Box,
  Button,
  CircularProgress,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import RecommendedTile from "./RecommendedTile";
import { useUser } from "../../../hooks/useUser";
import { getVideoOptions } from "../../../utils/api";
import { VideoOption } from "../../../utils/types";

type RecommendedFeedProps = {
  currentVideoId: string;
};

const styles = {
  recommendedContainer: {
    height: "100%",
    minWidth: "308px",
    width: { xs: "100%", md: "25%" },
    marginBottom: { xs: "0", md: "20px" },
    overflow: "visible",
  },
  refetchLayer: {
    marginBottom: "30px",
  },
};

/**
 * Recommended feed used in Watch component.
 */
function RecommendedFeed({ currentVideoId }: RecommendedFeedProps) {
  const { user } = useUser();
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState<boolean>(false);
  const [videoList, setVideoList] = useState<VideoOption[]>([]);
  const [hasMoreVideos, setHasMoreVideos] = useState<boolean>(true);
  const videoPageRef = useRef<number>(1);
  const initialFetchDoneRef = useRef(false);
  const seedRef = useRef<string>(Math.random().toString(36).substring(2));
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);
  const pageSize = 10;

  const fetchVideoOptions = useCallback(async () => {
    if (!user || loading) return;
    setLoading(true);

    const token = await user.getIdToken();
    const { videoOptions: newVideoOptions, hasMore } = await getVideoOptions(
      seedRef.current,
      videoPageRef.current,
      pageSize,
      currentVideoId,
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
  }, [user, loading, currentVideoId]);

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
        currentVideoId,
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
  }, [user, currentVideoId]);

  useEffect(() => {
    const shouldObserve =
      initialFetchDoneRef.current && !isBelowMd && hasMoreVideos && !loading;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchVideoOptions();
        }
      },
      { threshold: 1.0 }
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
  }, [hasMoreVideos, isBelowMd, loading, fetchVideoOptions]);

  return (
    <Box sx={styles.recommendedContainer}>
      <Stack spacing={1.5}>
        {videoList.map((video) => (
          <RecommendedTile video={video} key={video.id} />
        ))}
      </Stack>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && hasMoreVideos && (
        <>
          {!isBelowMd ? (
            <div ref={observerRef} style={styles.refetchLayer} />
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button variant="outlined" fullWidth onClick={fetchVideoOptions}>
                Load More
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default RecommendedFeed;
