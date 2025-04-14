import UploadForm from "./UploadForm";


import { useEffect, useState } from "react";
import { useUser } from "../../hooks/useUser";

import ProfileBanner from "./ProfileBanner";
import { VideoOption } from "../../utils/types";

function Profile() {
  const { user } = useUser();
  const [videoList, setVideoList] = useState<VideoOption[]>([]);

  
  return (

    <ProfileBanner />

  
  );  
}

export default Profile;
