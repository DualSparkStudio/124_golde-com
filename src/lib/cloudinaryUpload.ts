import { cloudinary } from "./cloudinary";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function uploadToCloudinary(
  file: Buffer,
  mimeType: string,
  filename: string,
): Promise<{ publicId: string; url: string }> {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(
      `Invalid MIME type: ${mimeType}. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
    );
  }

  if (file.length > MAX_FILE_SIZE) {
    throw new Error(
      `File size ${file.length} bytes exceeds maximum allowed size of ${MAX_FILE_SIZE} bytes (10MB)`,
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "jewelry-shop",
        public_id: filename.replace(/\.[^/.]+$/, ""),
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(new Error(error?.message ?? "Upload failed"));
          return;
        }
        resolve({
          publicId: result.public_id,
          url: result.secure_url,
        });
      },
    );
    uploadStream.end(file);
  });
}
