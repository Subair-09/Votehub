import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// Check if Cloudinary is configured
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

// Lazy initialization of Cloudinary configuration
export function getCloudinaryClient() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    return cloudinary;
  }
  return null;
}

export function getCloudinaryStatus() {
  const configured = isCloudinaryConfigured();
  return {
    configured,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ? `${process.env.CLOUDINARY_CLOUD_NAME.slice(0, 3)}***` : null,
    message: configured
      ? 'Cloudinary storage is active and ready for media uploads.'
      : 'CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET not set. Operating in graceful fallback upload mode.',
  };
}

/**
 * Upload a file buffer to Cloudinary using upload_stream.
 * Falls back to base64 Data URI if Cloudinary credentials are not configured yet,
 * ensuring the app remains fully functional in development/preview.
 */
export async function uploadMedia(
  buffer: Buffer,
  folder: string = 'votehub',
  filename?: string
): Promise<{
  url: string;
  secure_url: string;
  public_id: string;
  provider: 'cloudinary' | 'fallback';
  format?: string;
}> {
  const client = getCloudinaryClient();

  if (client) {
    return new Promise((resolve, reject) => {
      const uploadStream = client.uploader.upload_stream(
        {
          folder,
          public_id: filename ? `${filename.replace(/\.[^/.]+$/, '')}_${Date.now()}` : undefined,
          resource_type: 'auto',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result?: UploadApiResponse) => {
          if (error) {
            console.error('[Cloudinary] Upload error:', error);
            reject(new Error(error.message || 'Failed to upload image to Cloudinary'));
            return;
          }
          if (!result) {
            reject(new Error('Cloudinary upload returned empty result'));
            return;
          }
          resolve({
            url: result.url,
            secure_url: result.secure_url,
            public_id: result.public_id,
            provider: 'cloudinary',
            format: result.format,
          });
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Graceful in-memory fallback for local preview when credentials are not yet added
  console.log('[Cloudinary] No credentials configured. Using encoded data-URI storage fallback.');
  const base64 = buffer.toString('base64');
  const dataUri = `data:image/jpeg;base64,${base64}`;
  const mockId = `local_${Date.now()}`;

  return {
    url: dataUri,
    secure_url: dataUri,
    public_id: mockId,
    provider: 'fallback',
    format: 'jpeg',
  };
}
