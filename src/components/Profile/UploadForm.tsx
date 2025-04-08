import {
  CloudUpload as CloudUploadIcon,
  Videocam as VideocamIcon,
  Image as ImageIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
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
import { useUser } from "../../hooks/useUser";
import { uploadVideo } from "../../utils/api";

function UploadForm() {
  const { user } = useUser();
  const [dialogOpen, setDialogOpen] = useState<boolean>(true);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  /**
   * Handle attaching a video file.
   * @param {React.ChangeEvent<HTMLInputElement>} event Video upload event.
   */
  function handleVideoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
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
    const token = await user?.getIdToken();
    uploadVideo(title, description, videoFile, thumbnailFile, user?.uid, token);
  }

  return (
    <Dialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
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
        <Box sx={{ mt: 3, p: 2, border: "1px dashed grey", borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            <VideocamIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Video Upload
          </Typography>
          {videoFile ? (
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mt: 2 }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" noWrap>
                  {videoFile.name} (
                  {(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                </Typography>
                {videoPreview && (
                  <Box sx={{ mt: 1 }}>
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
              sx={{ mt: 1 }}
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
        <Box sx={{ mt: 3, p: 2, border: "1px dashed grey", borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            <ImageIcon sx={{ mr: 1, verticalAlign: "middle" }} />
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
              sx={{ mt: 2 }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" noWrap>
                  {thumbnailFile.name} (
                  {(thumbnailFile.size / (1024 * 1024)).toFixed(2)} MB)
                </Typography>
                {thumbnailPreview && (
                  <Box sx={{ mt: 1 }}>
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
              sx={{ mt: 1 }}
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
          <Button variant="outlined">Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!title || !videoFile}
          >
            Upload
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

export default UploadForm;
