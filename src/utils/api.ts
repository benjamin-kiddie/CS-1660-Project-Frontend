export function uploadVideo(
  title: string,
  description: string,
  uploader: string,
  videoFile: File | null,
  thumbnailFile: File | null,
  token?: string
) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("uploaderUsername", "yourUsername");
  if (videoFile) formData.append("videoFile", videoFile);
  if (thumbnailFile) formData.append("thumbnailFile", thumbnailFile);

  fetch("http://localhost:3000/video/video", {
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
