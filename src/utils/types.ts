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
