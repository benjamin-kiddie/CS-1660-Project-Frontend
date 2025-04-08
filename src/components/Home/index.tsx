import { Grid2 as Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";
import { getVideoOptions } from "../../utils/api";
import { VideoOption } from "../../utils/types";
import VideoOptionTile from "../VideoOptionTile";

// TODO: Make order "random", paginate while scrolling
// TODO: Make skeleton while loading?

/**
 * Front page component.
 * Shows list of videos.
 */
function Home() {
  const { user } = useUser();
  const [videoList, setVideoList] = useState<VideoOption[]>([]);

  useEffect(() => {
    const fetchVideoOptions = async () => {
      if (!user) return;
      const token = await user?.getIdToken();
      const newVideoList = await getVideoOptions(token);
      if (newVideoList.length > 0) {
        setVideoList(newVideoList);
      }
    };

    fetchVideoOptions();
  }, [user]);

  return (
    <Grid container spacing={3}>
      {videoList.map((video) => (
        <Grid size={{ xs: 7, sm: 6, md: 4, lg: 4 }} key={video.id}>
          <VideoOptionTile video={video} />
        </Grid>
      ))}
    </Grid>
  );
}

export default Home;
