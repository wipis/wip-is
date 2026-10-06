import type { APIRoute } from "astro";
import { parseWorkPost } from "../../../lib/work-post";
import { createWorkStore, WorkConflict } from "../../../lib/server/work-store";

const store = createWorkStore(process.cwd());
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

function isLocal(request: Request) {
  return import.meta.env.DEV && ["localhost", "127.0.0.1", "[::1]"].includes(new URL(request.url).hostname);
}

export const GET: APIRoute = async ({ request }) => {
  if (!isLocal(request)) return json({ error: "This editor is available locally only." }, 404);
  return json(await store.read());
};

export const POST: APIRoute = async ({ request }) => {
  if (!isLocal(request)) return json({ error: "This editor is available locally only." }, 404);
  if (request.headers.get("Origin") !== new URL(request.url).origin) return json({ error: "Invalid request origin." }, 403);
  if (Number(request.headers.get("Content-Length")) > 12 * 1024 * 1024) return json({ error: "Images must be under 10 MB." }, 413);
  try {
    const form = await request.formData();
    const revision = Number(form.get("revision"));
    if (!Number.isInteger(revision) || revision < 0) throw new Error("Invalid revision.");
    if (form.get("operation") === "delete") {
      return json(await store.update(revision, String(form.get("id"))));
    }
    if (form.get("operation") !== "save") throw new Error("Invalid operation.");
    const post = parseWorkPost(JSON.parse(String(form.get("post"))));
    const upload = form.get("image");
    let image: Uint8Array | undefined;
    let extension: string | undefined;
    if (upload instanceof File && upload.size) {
      if (upload.size > 10 * 1024 * 1024) return json({ error: "Images must be under 10 MB." }, 413);
      image = new Uint8Array(await upload.arrayBuffer());
      if (image[0] === 0x89 && image[1] === 0x50 && image[2] === 0x4e && image[3] === 0x47) extension = "png";
      else if (image[0] === 0xff && image[1] === 0xd8 && image[2] === 0xff) extension = "jpg";
      else if (new TextDecoder().decode(image.slice(0, 4)) === "RIFF" && new TextDecoder().decode(image.slice(8, 12)) === "WEBP") extension = "webp";
      else throw new Error("Upload a PNG, JPEG, or WebP image.");
      if (post.published && !post.imageAlt) throw new Error("Add a description of the image before publishing.");
    }
    return json(await store.update(revision, post.id, post, image, extension));
  } catch (error) {
    if (error instanceof WorkConflict) return json({ error: error.message }, 409);
    if (error instanceof SyntaxError) return json({ error: "Invalid work entry." }, 400);
    if (error instanceof Error && !("code" in error)) return json({ error: error.message }, 400);
    console.error("Unable to save work", error);
    return json({ error: "Unable to save. Your current work file has been preserved." }, 500);
  }
};
