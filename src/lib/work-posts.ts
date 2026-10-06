import data from "../data/work.json";
import { parseWorkDocument } from "./work-post";

export const WORK_DOCUMENT = parseWorkDocument(data);
export const PUBLISHED_WORK = WORK_DOCUMENT.posts
  .filter((post) => post.published)
  .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

export const WORK_IMAGES = PUBLISHED_WORK.filter((post) => post.image);
