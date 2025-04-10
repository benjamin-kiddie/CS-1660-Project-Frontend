import { Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import ReccomendedTile from "./ReccomendedTile";
import { useUser } from "../../../hooks/useUser";
import { getVideoOptions } from "../../../utils/api";
import { VideoOption } from "../../../utils/types";

type ReccomendedFeedProps = {
  currentVideoId: string;
};

const styles = {
  reccomendedContainer: {
    height: "100%",
    minWidth: "308px",
    width: { xs: "100%", md: "25%" },
    overflow: "auto",
  },
};

/**
 * Reccomended feed used in Watch component.
 */
function ReccomendedFeed({ currentVideoId }: ReccomendedFeedProps) {
  const { user } = useUser();
  const [videoList, setVideoList] = useState<VideoOption[]>([]);

  useEffect(() => {
    const fetchVideoOptions = async () => {
      if (!user) return;
      const token = await user.getIdToken();
      const newVideoList = await getVideoOptions(token);
      if (newVideoList.length > 0) {
        setVideoList(newVideoList);
      }
    };

    fetchVideoOptions();
  }, [user]);

  return (
    <Box sx={styles.reccomendedContainer}>
      <Stack spacing={2}>
        {videoList
          .filter((video) => video.id != currentVideoId)
          .map((video) => (
            <ReccomendedTile video={video} key={video.id} />
          ))}
      </Stack>
    </Box>
  );
}

export default ReccomendedFeed;
