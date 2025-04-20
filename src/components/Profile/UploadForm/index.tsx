import {
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Videocam as VideocamIcon,
  Image as ImageIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import styles from "./styles";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useUser } from "../../../hooks/useUser";
import { uploadVideo } from "../../../utils/api";

type UploadFormProps = {
  refetchVideos: () => void;
};

const allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
const allowedThumbnailTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

function UploadForm({ refetchVideos }: UploadFormProps) {
  const { user } = useUser();
  const { showSnackbar } = useSnackbar();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Handle attaching a video file.
   * @param {React.ChangeEvent<HTMLInputElement>} event Video upload event.
   */
  function handleVideoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;

    // check file type
    if (file && !allowedVideoTypes.includes(file.type)) {
      setVideoError("Invalid file type. Allowed types: MP4, WebM, OGG");
      setVideoFile(null);
      setVideoPreview(null);
      return;
    }

    setVideoError(null);
    setVideoFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    } else {
      setVideoPreview(null);
    }
  }

  /**
   * Handle attaching a thumbnail file.
   * @param {React.ChangeEvent<HTMLInputElement>} event Image upload event.
   */
  function handleThumbnailChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;

    // check file type
    if (file && !allowedThumbnailTypes.includes(file.type)) {
      setThumbnailError(
        "Invalid file type. Allowed types: JPEG, PNG, WebP, GIF"
      );
      setThumbnailFile(null);
      setThumbnailPreview(null);
      return;
    }

    // check aspect ratio
    if (file) {
      const img = new Image();
      img.onload = () => {
        if (img.width < 640) {
          setThumbnailError("Thumbnail must be at least 640px wide.");
          setThumbnailFile(null);
          setThumbnailPreview(null);
          return;
        }
        setThumbnailError(null);
        setThumbnailFile(file);
        const previewUrl = URL.createObjectURL(file);
        setThumbnailPreview(previewUrl);
      };
    } else {
      setThumbnailError(null);
      setThumbnailFile(null);
      setThumbnailPreview(null);
    }

    setThumbnailFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    } else {
      setThumbnailPreview(null);
    }
  }

  /**
   * Handle clearing the video file.
   */
  function clearVideoFile() {
    setVideoError(null);
    setVideoFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
  }

  /**
   * Handle clearing the thumbnail file.
   */
  function clearThumbnailFile() {
    setThumbnailError(null);
    setThumbnailFile(null);
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
      setThumbnailPreview(null);
    }
  }

  /**
   * Handle submitting the form.
   * @param {React.FormEvent} event Form submission event.
   */
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user) return;

    setLoading(true);
    const token = await user.getIdToken();
    const newVideoId = await uploadVideo(
      title,
      description,
      videoFile,
      thumbnailFile,
      token
    );
    setLoading(false);
    if (newVideoId) {
      showSnackbar("Uploaded video", "success");
      refetchVideos();
      handleClose();
    } else {
      showSnackbar("Something went wrong", "error");
    }
  }

  /**
   * Close the modal and clear form inputs.
   */
  function handleClose() {
    setTitle("");
    setDescription("");
    setVideoFile(null);
    setVideoError(null);
    setThumbnailFile(null);
    setThumbnailError(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
      setThumbnailPreview(null);
    }
    setDialogOpen(false);
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setDialogOpen(true)}
        sx={styles.dialogButton}
      >
        Upload Video
      </Button>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: handleSubmit,
          },
        }}
      >
        <DialogTitle>Upload Video</DialogTitle>
        <DialogContent>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            name="description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Box sx={styles.uploadContainer}>
            <Typography variant="subtitle1" gutterBottom>
              <VideocamIcon sx={styles.icon} />
              Video Upload
            </Typography>
            {videoError && (
              <Typography color="error" variant="body2">
                {videoError}
              </Typography>
            )}
            {videoFile ? (
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={styles.file}
              >
                <Box sx={styles.previewContainer}>
                  <Typography variant="body2" noWrap>
                    {videoFile.name} (
                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </Typography>
                  {videoPreview && (
                    <Box sx={styles.preview}>
                      <video
                        controls
                        width="100%"
                        height="auto"
                        src={videoPreview}
                      />
                    </Box>
                  )}
                </Box>
                <IconButton onClick={clearVideoFile} size="small">
                  <ClearIcon />
                </IconButton>
              </Stack>
            ) : (
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={styles.uploadButton}
              >
                Select Video
                <input
                  type="file"
                  hidden
                  accept="video/*"
                  onChange={handleVideoChange}
                />
              </Button>
            )}
          </Box>
          <Box sx={styles.uploadContainer}>
            <Typography variant="subtitle1" gutterBottom>
              <ImageIcon sx={styles.icon} />
              Thumbnail Upload
            </Typography>
            {thumbnailError && (
              <Typography color="error" variant="body2">
                {thumbnailError}
              </Typography>
            )}
            {thumbnailFile ? (
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={styles.file}
              >
                <Box sx={styles.previewContainer}>
                  <Typography variant="body2" noWrap>
                    {thumbnailFile.name} (
                    {(thumbnailFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </Typography>
                  {thumbnailPreview && (
                    <Box sx={styles.preview}>
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                      />
                    </Box>
                  )}
                </Box>
                <IconButton onClick={clearThumbnailFile} size="small">
                  <ClearIcon />
                </IconButton>
              </Stack>
            ) : (
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={styles.uploadButton}
              >
                Select Thumbnail
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />
              </Button>
            )}
          </Box>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!title || !videoFile || loading}
            >
              {loading ? <CircularProgress size={20} /> : "Upload"}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UploadForm;
