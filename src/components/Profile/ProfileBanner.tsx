import { Avatar, Typography, Box, Button } from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";
import { Link, useLocation, useNavigate} from "react-router-dom";

import { useUser } from "../../hooks/useUser";
import styles from "./styles";
import { useEffect, useState } from "react";
import { VideoOption } from "../../utils/types";



function ProfileBanner() {

    const { user } = useUser();
    const location = useLocation();
    const navigate = useNavigate();

    

    return (
 
        <Box sx={styles.bannerContainer}>
            <Box sx={styles.logoAndNameContainer}>
                <Avatar sx={styles.avatar}
                    alt={user.displayName || "User"}
                    src={user.photoURL || "/default-avatar.png"} 
                />
                <Typography variant="h5" sx={styles.name}>{user.displayName}</Typography>
            </Box>
            <Link sx={styles.uploadButton} state={{ backgroundLocation: location }} to="/upload">
              <UploadIcon />
            </Link>
        </Box>

    );
    
}

export default ProfileBanner;