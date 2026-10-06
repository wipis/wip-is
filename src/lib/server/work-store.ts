import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { parseWorkDocument, parseWorkPost, type WorkPost } from "../work-post";

export class WorkConflict extends Error {}

export function createWorkStore(root: string) {
  const file = join(root, "src/data/work.json");
  let writes: Promise<unknown> = Promise.resolve();

  const read = async () => parseWorkDocument(JSON.parse(await readFile(file, "utf8")));

  const update = (revision: number, id: string, post?: WorkPost, image?: Uint8Array, extension?: string) => {
    const task = writes.catch(() => {}).then(async () => {
      const document = await read();
      if (document.revision !== revision) throw new WorkConflict("The work list changed. Reload it before saving.");
      if (!/^[a-z0-9-]{1,80}$/.test(id)) throw new Error("Invalid entry ID.");
      if (post && post.id !== id) throw new Error("Entry IDs must match.");
      if (!post && !document.posts.some((entry) => entry.id === id)) throw new Error("Entry not found.");
      let imagePath: string | undefined;
      let parsed = post ? parseWorkPost(post) : undefined;
      if (image && parsed?.published && !parsed.imageAlt) throw new Error("Add a description of the image before publishing.");
      if (image && parsed) {
        if (!extension || !["png", "jpg", "webp"].includes(extension)) throw new Error("Unsupported image.");
        const imageName = `${randomUUID()}.${extension}`;
        const directory = join(root, "public/work");
        await mkdir(directory, { recursive: true });
        imagePath = join(directory, imageName);
        await writeFile(imagePath, image, { flag: "wx" });
        parsed = parseWorkPost({ ...parsed, image: `/work/${imageName}` });
      }
      const temporary = `${file}.${randomUUID()}.tmp`;
      try {
        const posts = document.posts.filter((entry) => entry.id !== id);
        if (parsed) {
          const previous = document.posts.findIndex((entry) => entry.id === id);
          posts.splice(previous < 0 ? 0 : previous, 0, parsed);
        }
        const result = { revision: document.revision + 1, posts };
        await writeFile(temporary, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
        await rename(temporary, file);
        return result;
      } catch (error) {
        await unlink(temporary).catch(() => {});
        if (imagePath) await unlink(imagePath).catch(() => {});
        throw error;
      }
    });
    writes = task;
    return task;
  };
  return { read, update };
}
