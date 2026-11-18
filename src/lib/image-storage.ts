import { getStore } from "@netlify/blobs";
import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

export const IMAGE_STORE_NAME = "product-images";

const LOCAL_URL_PREFIX = "/uploads/products/";
const BLOB_URL_PREFIX = "/api/uploads/";
const LOCAL_UPLOAD_DIR = path.join(
  process.cwd(),
  "public",
  "uploads",
  "products",
);

/**
 * Netlify Functions have a read-only, ephemeral filesystem, so uploads are
 * stored in Netlify Blobs there. Local development keeps using `public/`,
 * where Next.js serves files directly from disk.
 */
export function isNetlifyRuntime(): boolean {
  return Boolean(
    process.env.NETLIFY_BLOBS_CONTEXT ||
      process.env.SITE_ID ||
      process.env.NETLIFY === "true",
  );
}

export type StoredImage = {
  image_url: string;
  cleanup: () => Promise<void>;
};

export async function storeProductImage(
  buffer: Uint8Array,
  ext: string,
  contentType: string,
): Promise<StoredImage> {
  const fileName = `${randomUUID()}.${ext}`;

  if (isNetlifyRuntime()) {
    const store = getStore({ name: IMAGE_STORE_NAME });
    const bytes = new Uint8Array(buffer.byteLength);
    bytes.set(buffer);
    await store.set(fileName, bytes.buffer, { metadata: { contentType } });

    return {
      image_url: `${BLOB_URL_PREFIX}${fileName}`,
      cleanup: () => store.delete(fileName),
    };
  }

  await mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
  const filePath = path.join(LOCAL_UPLOAD_DIR, fileName);
  await writeFile(filePath, buffer);

  return {
    image_url: `${LOCAL_URL_PREFIX}${fileName}`,
    cleanup: () => unlink(filePath).catch(() => {}),
  };
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  if (imageUrl.startsWith(BLOB_URL_PREFIX)) {
    const key = imageUrl.slice(BLOB_URL_PREFIX.length);
    const store = getStore({ name: IMAGE_STORE_NAME });
    await store.delete(key);
    return;
  }

  if (imageUrl.startsWith(LOCAL_URL_PREFIX)) {
    const fileName = imageUrl.slice(LOCAL_URL_PREFIX.length);
    await unlink(path.join(LOCAL_UPLOAD_DIR, fileName)).catch(() => {});
  }
}
