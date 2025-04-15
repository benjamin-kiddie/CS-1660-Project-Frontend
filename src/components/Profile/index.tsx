import UploadForm from "./UploadForm";


import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";

import ProfileBanner from "./ProfileBanner";
import { VideoOption } from "../../utils/types";
import { Grid } from "@mui/material";
import VideoOptionTile from "../VideoOptionTile/index";
import { getUserVideoOptions } from "../../utils/api";

function Profile() {
  const { user } = useUser();
  const [videoList, setVideoList] = useState<VideoOption[]>([]);

  useEffect(() => {
    const fetchVideoOptions = async () => {
      if (!user) return;
      const token = await user?.getIdToken();
      const newVideoList = await getUserVideoOptions(token);
      if (newVideoList.length > 0) {
        setVideoList(newVideoList);
      }
    };

    fetchVideoOptions();
  }, [user]);

  
  return (
    <>
    <ProfileBanner />
    <Grid container spacing={3}>
      {videoList.map((video) => (
        <Grid size={{ xs: 7, sm: 6, md: 4, lg: 4 }} key={video.id}>
          <VideoOptionTile video={video} />
        </Grid>
      ))}
    </Grid>
    </>
  
  );  
}

export default Profile;
