import type { WorkItem } from "./work";

export interface WorkPost extends WorkItem {
  id: string;
  published: boolean;
  image?: string;
  imageAlt?: string;
  caption?: string;
}

export interface WorkDocument {
  revision: number;
  posts: WorkPost[];
}

export function parseWorkPost(value: unknown): WorkPost {
  if (!value || typeof value !== "object") throw new Error("Invalid work entry.");
  const data = value as Record<string, unknown>;
  const text = (key: string, max: number, required = false) => {
    const value = data[key];
    if (value !== undefined && typeof value !== "string") throw new Error(`Invalid ${key}.`);
    const result = typeof value === "string" ? value.trim() : "";
    if ((required && !result) || result.length > max) throw new Error(`Check the ${key} field.`);
    return result;
  };
  const id = text("id", 80, true);
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error("Invalid entry ID.");
  const company = text("company", 120, true);
  const project = text("project", 200);
  const href = text("href", 2048);
  if (href && !/^https?:\/\//.test(href)) throw new Error("Project links must start with https:// or http://.");
  if (href) new URL(href);
  const year = data.year;
  if (typeof year !== "number" || !Number.isInteger(year) || year < 1900 || year > 2100) {
    throw new Error("Enter a year between 1900 and 2100.");
  }
  if (typeof data.published !== "boolean") throw new Error("Invalid publication status.");
  const image = text("image", 200);
  if (image && !/^\/(?:work\/)?[a-z0-9-]+\.(png|jpg|webp)$/.test(image)) throw new Error("Invalid image path.");
  const imageAlt = text("imageAlt", 300);
  if (data.published && image && !imageAlt) throw new Error("Add a description of the image before publishing.");
  const caption = text("caption", 1000);
  return { id, company, year, published: data.published, project, href, image, imageAlt, caption };
}

export function parseWorkDocument(value: unknown): WorkDocument {
  if (!value || typeof value !== "object") throw new Error("Invalid work file.");
  const data = value as Record<string, unknown>;
  if (!Number.isInteger(data.revision) || Number(data.revision) < 0 || !Array.isArray(data.posts)) {
    throw new Error("Invalid work file.");
  }
  const posts = data.posts.map(parseWorkPost);
  if (new Set(posts.map((post) => post.id)).size !== posts.length) throw new Error("Duplicate work entry IDs.");
  return { revision: Number(data.revision), posts };
}
