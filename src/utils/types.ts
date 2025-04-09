// Representation of a video that a user can select to watch.
export type VideoOption = {
  id: string;
  title: string;
  uploaderDisplayName: string;
  uploaderPfp: string;
  uploadDate: string;
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
  uploadDate: string;
  views: number;
  videoSignedUrl: string;
};
