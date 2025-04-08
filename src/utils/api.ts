import { VideoOption } from "./types";

const apiUrl = import.meta.env.VITE_API_URL;

/**
 * Upload a video and thumbnail (optional) to the API.
 * @param {string} title Title of the video.
 * @param {string} description Description of the video.
 * @param {File | null} videoFile The video file to upload.
 * @param {File | null} thumbnailFile The thumbnail file to upload (optional).
 * @param {string} uploader The uploader's UID.
 * @param {string} token JWT for authorization.
 */
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

/**
 * Fetch video options from the API.
 * @param {string} token JWT for authorization.
 * @returns {Promise<VideoOption[]>} Array of video options.
 */
export async function getVideoOptions(token?: string): Promise<VideoOption[]> {
  try {
    const response = await fetch(`${apiUrl}/video`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return data.videoOptions;
  } catch (error) {
    console.error("Error fetching video options:", error);
    return [];
  }
}
