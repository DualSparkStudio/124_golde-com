/**
 * Generates Cloudinary WebP transformation URLs for responsive images.
 */

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

export function getCloudinaryUrl(publicId: string, width: number): string {
  if (!CLOUD_NAME || !publicId) return "";
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_webp,q_auto,w_${width}/${publicId}`;
}

export function getCloudinarySrcSet(publicId: string): string {
  return [400, 800, 1200]
    .map((w) => `${getCloudinaryUrl(publicId, w)} ${w}w`)
    .join(", ");
}

export function getCloudinaryBlurUrl(publicId: string): string {
  return getCloudinaryUrl(publicId, 20);
}
