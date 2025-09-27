import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from './config';

// Cloudflare R2 configuration
const r2Client = new S3Client({
  region: 'auto', // Cloudflare R2 uses 'auto' region
  endpoint: `https://${config.r2.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.r2.accessKeyId,
    secretAccessKey: config.r2.secretAccessKey,
  },
});

export interface R2UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export interface R2UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  isPublic?: boolean;
}

/**
 * Upload a file to Cloudflare R2
 */
export async function uploadToR2(
  buffer: Buffer,
  key: string,
  options: R2UploadOptions = {}
): Promise<R2UploadResult> {
  try {
    const {
      contentType = 'image/png',
      metadata = {},
      isPublic = true
    } = options;

    const commandParams: any = {
      Bucket: config.r2.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      Metadata: {
        ...metadata,
        'uploaded-at': new Date().toISOString(),
      },
    };

    // Make the object publicly readable if specified
    if (isPublic) {
      commandParams.ACL = 'public-read';
    }

    const command = new PutObjectCommand(commandParams);

    await r2Client.send(command);

    // Construct the public URL
    const publicUrl = `${config.r2.publicUrl}/${key}`;

    return {
      success: true,
      url: publicUrl,
      key,
    };
  } catch (error) {
    console.error('R2 upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error',
    };
  }
}

/**
 * Generate a presigned URL for uploading to R2
 */
export async function generateUploadPresignedUrl(
  key: string,
  contentType: string = 'image/png',
  expiresIn: number = 3600 // 1 hour
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: config.r2.bucketName,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Generate a presigned URL for downloading from R2
 */
export async function generateDownloadPresignedUrl(
  key: string,
  expiresIn: number = 3600 // 1 hour
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: config.r2.bucketName,
    Key: key,
  });

  return getSignedUrl(r2Client, command, { expiresIn });
}

/**
 * Delete a file from R2
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: config.r2.bucketName,
      Key: key,
    });

    await r2Client.send(command);
    return true;
  } catch (error) {
    console.error('R2 delete error:', error);
    return false;
  }
}

/**
 * Generate a unique file key for storing images
 */
export function generateImageKey(
  userId: string,
  type: 'original' | 'generated' = 'generated',
  extension: string = 'png'
): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2);
  return `images/${type}/${userId}/${timestamp}-${randomId}.${extension}`;
}

/**
 * Download image from URL and upload to R2
 */
export async function uploadImageFromUrl(
  imageUrl: string,
  userId: string,
  type: 'original' | 'generated' = 'generated'
): Promise<R2UploadResult> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || 'image/png';

    // Determine file extension from content type
    const extension = contentType.includes('jpeg') || contentType.includes('jpg') ? 'jpg' : 'png';

    // Generate unique key
    const key = generateImageKey(userId, type, extension);

    // Upload to R2
    return await uploadToR2(buffer, key, {
      contentType,
      metadata: {
        'source-url': imageUrl,
        'user-id': userId,
        'image-type': type,
      },
      isPublic: true,
    });
  } catch (error) {
    console.error('Upload from URL error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error',
    };
  }
}

export default r2Client;