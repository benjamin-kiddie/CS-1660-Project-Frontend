// Representation of a video that a user can select to watch.
export type VideoOption = {
  id: string;
  title: string;
  uploaderDisplayName: string;
  uploaderPfp: string;
  uploadTimestamp: string;
  views: number;
  thumbnailSignedLink: string;
};

// Representation of a video the viewer has requested to watch.
export type VideoDetails = {
  id: string;
  title: string;
  description: string;
  uploaderDisplayName: string;
  uploaderPfp: string;
  uploadTimestamp: string;
  views: number;
  likes: number;
  dislikes: number;
  userLikeStatus: "like" | "dislike" | null;
  numComments: number;
  videoSignedUrl: string;
};

// Representation of a comment on a video.
export type CommentDetails = {
  id: string;
  comment: string;
  commenterId: string;
  commenterDisplayName: string;
  commenterPfp: string;
  commentTimestamp: string;
};
