import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeFile } from "node:fs/promises";
import { createWorkStore, WorkConflict } from "../src/lib/server/work-store.ts";
import { parseWorkPost } from "../src/lib/work-post.ts";

const post = { id: "example", company: "Example", year: 2026, published: false, project: "Product Design" };

test("drafts, publication, image uploads, edits and deletion persist to files", async () => {
  const root = await mkdtemp(join(tmpdir(), "wip-work-test-"));
  try {
    await mkdir(join(root, "src/data"), { recursive: true });
    await writeFile(join(root, "src/data/work.json"), JSON.stringify({ revision: 0, posts: [] }));
    const store = createWorkStore(root);
    await store.update(0, post.id, post);
    assert.equal((await store.read()).posts[0].published, false);
    const result = await store.update(1, post.id, { ...post, published: true, imageAlt: "A website screenshot" }, new Uint8Array([1, 2, 3]), "png");
    assert.equal(result.posts[0].published, true);
    assert.match(result.posts[0].image, /^\/work\/.+\.png$/);
    const persisted = createWorkStore(root);
    assert.deepEqual(await persisted.read(), result);
    assert.deepEqual(new Uint8Array(await readFile(join(root, "public", result.posts[0].image))), new Uint8Array([1, 2, 3]));
    await store.update(2, post.id, { ...result.posts[0], company: "Edited" });
    assert.equal((await store.read()).posts[0].company, "Edited");
    await store.update(3, post.id);
    assert.deepEqual((await store.read()).posts, []);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("stale simultaneous writes cannot overwrite newer work", async () => {
  const root = await mkdtemp(join(tmpdir(), "wip-conflict-test-"));
  try {
    await mkdir(join(root, "src/data"), { recursive: true });
    await writeFile(join(root, "src/data/work.json"), JSON.stringify({ revision: 0, posts: [] }));
    const store = createWorkStore(root);
    const results = await Promise.allSettled([
      store.update(0, post.id, post),
      store.update(0, "second", { ...post, id: "second" }),
    ]);
    assert.equal(results[0].status, "fulfilled");
    assert.equal(results[1].status, "rejected");
    assert.ok(results[1].reason instanceof WorkConflict);
    assert.equal((await store.read()).posts[0].id, post.id);
    assert.deepEqual(await readdir(join(root, "src/data")), ["work.json"]);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("invalid links and paths and missing published image descriptions are rejected", () => {
  assert.throws(() => parseWorkPost({ ...post, href: "javascript:alert(1)" }));
  assert.throws(() => parseWorkPost({ ...post, image: "/work/../../file.png" }));
  assert.throws(() => parseWorkPost({ ...post, image: "/work/image.png", published: true }));
  assert.throws(() => parseWorkPost({ ...post, year: 0 }));
  assert.equal(parseWorkPost({ ...post, image: "/shot-bridger-to.png", imageAlt: "Portfolio", published: true }).image, "/shot-bridger-to.png");
});
