import { Avatar, Typography, Box, Link, Button } from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";


import { useUser } from "../../hooks/useUser";
import styles from "./styles";



function ProfileBanner() {

    const { user } = useUser();
    
    return (
 
        <Box sx={styles.bannerContainer}>
            <Avatar sx={styles.avatar}
                alt={user.displayName || "User"}
                src={user.photoURL || "/default-avatar.png"} 
            />
            <Typography variant="h5" sx={styles.name}>{user.displayName}</Typography>
            <Button component={Link} to="/" sx={styles.uploadButton}>
              <UploadIcon />
              <Typography>Upload</Typography>
            </Button>
        </Box>

    );
    
}

export default ProfileBanner;