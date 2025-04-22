import { Delete as DeleteIcon } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Grid2 as Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles";
import UploadForm from "./UploadForm";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useUser } from "../../hooks/useUser";
import { deleteVideo, getUserVideoOptions } from "../../utils/api";
import { VideoOption } from "../../utils/types";
import VideoOptionTile from "../VideoOptionTile/index";
import VideoOptionTileSkeleton from "../VideoOptionTileSkeleton";

/**
 * Profile page component.
 * Displays a user's uploaded videos, ordered by upload timestamp.
 */
function Profile() {
  const { user } = useUser();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(false);
  const [videoList, setVideoList] = useState<VideoOption[]>([]);
  const [hasMoreVideos, setHasMoreVideos] = useState<boolean>(true);
  const videoPageRef = useRef<number>(1);
  const initialFetchDoneRef = useRef(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const pageSize = 15;

  /**
   * Fetch videos for the profile page.
   */
  const fetchVideoOptions = useCallback(async () => {
    if (!user || loading) return;
    setLoading(true);
    const token = await user?.getIdToken();
    const { videoOptions: newVideoOptions, hasMore } =
      await getUserVideoOptions(
        user.uid,
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
  }, [user, loading]);

  /**
   * Refetch videos by resetting the video list and fetching again.
   */
  function refetchVideos() {
    setVideoList([]);
    setHasMoreVideos(true);
    videoPageRef.current = 1;
    fetchVideoOptions();
  }

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
        await getUserVideoOptions(
          user.uid,
          videoPageRef.current,
          pageSize,
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

  /**
   * Handle deleting a video.
   * Delete the video from the video list.
   */
  async function handleDeleteVideo() {
    if (!selectedVideoId || !user) return;

    const token = await user.getIdToken();
    const success = await deleteVideo(selectedVideoId, token);
    if (success) {
      setVideoList((prevVideos) =>
        prevVideos.filter((video) => video.id !== selectedVideoId)
      );
      showSnackbar("Video deleted", "success");
    }

    handleMenuClose();
  }

  /**
   * Open the dropdown menu for a video.
   */
  function handleMenuOpen(
    event: React.MouseEvent<HTMLElement>,
    commentId: string
  ) {
    setAnchorEl(event.currentTarget);
    setSelectedVideoId(commentId);
  }

  /**
   * Close the dropdown menu for a video.
   */
  function handleMenuClose() {
    setAnchorEl(null);
    setSelectedVideoId(null);
  }

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
            <UploadForm refetchVideos={refetchVideos} />
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
            {videoList.map((video, index) => {
              const isLast = index === videoList.length - 1;
              return (
                <Grid
                  size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}
                  key={video.id}
                  ref={isLast && hasMoreVideos ? observerRef : null}
                >
                  <VideoOptionTile
                    video={video}
                    showMenu={true}
                    openMenu={handleMenuOpen}
                  />
                </Grid>
              );
            })}
            {loading &&
              Array.from({ length: pageSize }).map((_, index) => (
                <Grid
                  size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}
                  key={index}
                >
                  <VideoOptionTileSkeleton />
                </Grid>
              ))}
          </Grid>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleDeleteVideo}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Delete" />
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    )
  );
}

export default Profile;
