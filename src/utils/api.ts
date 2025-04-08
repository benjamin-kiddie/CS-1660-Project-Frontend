export function uploadVideo(
  title: string,
  description: string,
  videoFile: File | null,
  thumbnailFile: File | null,
  uploader?: string,
  token?: string
) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  if (uploader) formData.append("uploader", uploader);
  if (videoFile) formData.append("videoFile", videoFile);
  if (thumbnailFile) formData.append("thumbnailFile", thumbnailFile);

  const apiUrl = import.meta.env.VITE_API_URL;
  fetch(`${apiUrl}/video`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Video and thumbnail uploaded successfully:", data);
    })
    .catch((error) => {
      console.error("Error uploading video:", error);
    });
}
