import { getStore } from "@netlify/blobs";
import { IMAGE_STORE_NAME, isNetlifyRuntime } from "@/lib/image-storage";

const KEY_PATTERN = /^[0-9a-f-]+\.(jpg|png|webp)$/;

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/**
 * Netlify Blobs has no public URL, so stored images are served through this
 * route. Local development serves uploads from `public/` instead.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;

  if (!KEY_PATTERN.test(key) || !isNetlifyRuntime()) {
    return new Response("Not found", { status: 404 });
  }

  const store = getStore({ name: IMAGE_STORE_NAME });
  const data = await store.get(key, {
    type: "arrayBuffer",
    consistency: "strong",
  });

  if (!data) {
    return new Response("Not found", { status: 404 });
  }

  const ext = key.split(".").pop() ?? "jpg";

  return new Response(data, {
    headers: {
      "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
