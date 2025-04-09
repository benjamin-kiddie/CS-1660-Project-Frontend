/**
 * Find the time since upload, rounded to the largest unit of time.
 * @param {string} uploadDate Upload time in UTC format.
 * @returns {string} String showing time since upload.
 */
export function timeSinceUpload(uploadDate: string): string {
  const uploadTime = new Date(uploadDate);
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - uploadTime.getTime()) / 1000
  );

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} days ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} months ago`;
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} years ago`;
}
