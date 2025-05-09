import { CommentDetails, VideoDetails, VideoOption } from "./types";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Upload a video and thumbnail (optional) to the API.
 * @param {string} title Title of the video.
 * @param {string} description Description of the video.
 * @param {File | null} videoFile The video file to upload.
 * @param {File | null} thumbnailFile The thumbnail file to upload (optional).
 * @param {string} token JWT for authorization.
 * @returns {Promise<string | null>} The ID of the uploaded video or null if the upload failed.
 */
export async function uploadVideo(
  title: string,
  description: string,
  videoFile: File | null,
  thumbnailFile: File | null,
  token?: string
): Promise<string | null> {
  if (!videoFile) {
    console.error("No video file provided");
    return null;
  }

  let videoId: string | null = null;
  try {
    const metadataResponse = await fetch(`${apiUrl}/video`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        videoType: videoFile.type,
        thumbnailType: thumbnailFile ? thumbnailFile.type : undefined,
      }),
    });

    const data = await metadataResponse.json();
    if (!metadataResponse.ok) {
      throw new Error(data.error);
    }
    videoId = data.videoId;
    const { videoUploadUrl, thumbnailUploadUrl } = data;

    const videoUploadResponse = await fetch(videoUploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": videoFile.type,
      },
      body: videoFile,
    });
    if (!videoUploadResponse.ok) {
      throw new Error("Failed to upload video file");
    }

    if (thumbnailFile) {
      const thumbnailUploadResponse = await fetch(thumbnailUploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": thumbnailFile.type,
        },
        body: thumbnailFile,
      });
      if (!thumbnailUploadResponse.ok) {
        throw new Error("Failed to upload thumbnail file");
      }
    } else {
      const thumbnailGenerationResponse = await fetch(
        `${apiUrl}/video/thumbnail`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoId }),
        }
      );
      if (!thumbnailGenerationResponse.ok) {
        throw new Error("Failed to generate thumbnail");
      }
    }

    return videoId;
  } catch (error) {
    console.error("Error uploading video:", error);
    if (videoId) {
      // video upload failed, delete the video metadata and files if they exist
      await deleteVideo(videoId, token);
    }
    return null;
  }
}

/**
 * Delete a video from the API.
 * @param {string} videoId ID of the video to delete.
 * @param {string} token JWT for authorization.
 * @returns {Promise<boolean>} True if the video was deleted successfully, false otherwise.
 */
export async function deleteVideo(
  videoId: string,
  token?: string
): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/video/${videoId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error);
    }
    return true;
  } catch (error) {
    console.error("Error deleting video:", error);
    return false;
  }
}

/**
 * Fetch video options from the API.
 * @param {string} seed Seed for randomization.
 * @param {number} page Page number for pagination.
 * @param {number} limit Number of video options to fetch.
 * @param {string} excludeId ID of the video to exclude from the results.
 * @param {string} token JWT for authorization.
 * @returns {Promise<VideoOption[], boolean>} Array of video options and whether or not more can be fetched.
 */
export async function getVideoOptions(
  seed: string,
  page?: number,
  limit?: number,
  excludeId?: string,
  token?: string
): Promise<{ videoOptions: VideoOption[]; hasMore: boolean }> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("seed", seed);
    if (page !== undefined) queryParams.append("page", page.toString());
    if (limit !== undefined) queryParams.append("limit", limit.toString());
    if (excludeId) queryParams.append("excludeId", excludeId);

    const response = await fetch(`${apiUrl}/video?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error("Error fetching video options:", error);
    return { videoOptions: [], hasMore: true };
  }
}

/**
 * Fetch user's uploaded video options from the API.
 * @param {string} userId ID of the user.
 * @param {string} token JWT for authorization.
 * @returns {Promise<VideoOption[], boolean>} Array of video options.
 */
export async function getUserVideoOptions(
  userId: string,
  page?: number,
  limit?: number,
  token?: string
): Promise<{ videoOptions: VideoOption[]; hasMore: boolean }> {
  try {
    const queryParams = new URLSearchParams();
    if (page !== undefined) queryParams.append("page", page.toString());
    if (limit !== undefined) queryParams.append("limit", limit.toString());

    const response = await fetch(
      `${apiUrl}/video/user/${userId}?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error("Error fetching video options:", error);
    return { videoOptions: [], hasMore: true };
  }
}

/**
 * Search for video options based on a query.
 * @param {string} query Search query.
 * @param {number} page Page number for pagination.
 * @param {number} limit Number of video options to fetch.
 * @param {string} token JWT for authorization.
 * @returns {Promise<VideoOption[], boolean>} Array of video options and whether or not more can be fetched.
 */
export async function searchVideoOptions(
  query: string,
  page?: number,
  limit?: number,
  token?: string
): Promise<{ videoOptions: VideoOption[]; hasMore: boolean }> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("query", query);
    if (page !== undefined) queryParams.append("page", page.toString());
    if (limit !== undefined) queryParams.append("limit", limit.toString());

    const response = await fetch(
      `${apiUrl}/video/search?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error("Error searching video options:", error);
    return { videoOptions: [], hasMore: true };
  }
}

/**
 * Fetch video details from the API.
 * @param {string} videoId ID of the video.
 * @param {string} token JWT for authorization.
 * @returns
 */
export async function getVideoDetails(
  videoId: string,
  token?: string
): Promise<VideoDetails | null> {
  try {
    const response = await fetch(`${apiUrl}/video/${videoId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error("Error fetching video details:", error);
    return null;
  }
}

/**
 * Increment the view count of a video.
 * @param {string} videoId ID of the video.
 * @param {string} token JWT for authorization.
 */
export async function incrementViewCount(videoId: string, token?: string) {
  try {
    const response = await fetch(`${apiUrl}/video/${videoId}/view`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to increment view count");
    }
  } catch (error) {
    console.error("Error incrementing view count:", error);
  }
}

/**
 * Fetch comments for a video from the API.
 * @param {string} videoId ID of the video.
 * @param {string} lastCommentId ID of the last comment (for pagination).
 * @param {string} token JWT for authorization.
 * @returns {Promise<CommentDetails[], boolean>} Array of comments and boolean indicating if more exist.
 */
export async function getComments(
  videoId: string,
  lastCommentId?: string,
  token?: string
): Promise<{ comments: CommentDetails[]; hasMore: boolean }> {
  try {
    const queryParams = new URLSearchParams();
    if (lastCommentId) queryParams.append("lastCommentId", lastCommentId);

    const response = await fetch(
      `${apiUrl}/video/${videoId}/comments?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return { comments: [], hasMore: true };
  }
}

/**
 * Post a comment to the API.
 * @param {string} videoId ID of the video.
 * @param {string} comment The comment text.
 * @param {string} commenterId The commenter's UID.
 * @param {string} token JWT for authorization.
 */
export async function postComment(
  videoId: string,
  comment: string,
  commenterId?: string,
  token?: string
): Promise<CommentDetails | null> {
  try {
    const response = await fetch(`${apiUrl}/video/${videoId}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment, commenterId }),
    });
    if (!response.ok) {
      throw new Error("Failed to post comment");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error posting comment:", error);
    return null;
  }
}

/**
 * Delete a comment from the API.
 * @param {string} videoId ID of the video.
 * @param {string} commentId ID of the comment.
 * @param {string} token JWT for authorization.
 * @return {Promise<boolean>} True if the comment was deleted successfully, false otherwise.
 */
export async function deleteComment(
  videoId: string,
  commentId: string,
  token?: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `${apiUrl}/video/${videoId}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete comment");
    }
    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return false;
  }
}

/**
 * Toggle the like/dislike reactino for a video.
 * @param {string} videoId ID of the video.
 * @param {"like" | "dislike"} type Type of reaction to toggle.
 * @param {string} token JWT for authorization.
 */
export async function toggleReaction(
  videoId: string,
  type: "like" | "dislike",
  token?: string
) {
  try {
    const response = await fetch(`${apiUrl}/video/${videoId}/${type}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to update reaction");
    }
  } catch (error) {
    console.error("Error updating reaction:", error);
  }
}
