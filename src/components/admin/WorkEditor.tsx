import { useEffect, useState, type SubmitEvent } from "react";
import type { WorkDocument, WorkPost } from "../../lib/work-post";

const inputClass = "mt-2 block w-full border border-[var(--app-border)] bg-transparent px-3 py-2 text-[var(--app-fg)]";
const blank = (): WorkPost => ({ id: "", company: "", year: new Date().getFullYear(), project: "", href: "", caption: "", imageAlt: "", published: false });

export default function WorkEditor({ initial }: { initial: WorkDocument }) {
  const [document, setDocument] = useState(initial);
  const [post, setPost] = useState<WorkPost>(blank);
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fileKey, setFileKey] = useState(0);

  useEffect(() => {
    if (!image) { setPreview(""); return; }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  function select(entry: WorkPost) {
    setPost(entry);
    setImage(undefined);
    setFileKey((key) => key + 1);
    setError("");
    setMessage("");
  }

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = event.nativeEvent.submitter;
    const published = submitter instanceof HTMLButtonElement && submitter.value === "publish";
    const saved = { ...post, id: post.id || crypto.randomUUID(), published };
    const form = new FormData();
    form.set("operation", "save");
    form.set("revision", String(document.revision));
    form.set("post", JSON.stringify(saved));
    if (image) form.set("image", image);
    await send(form, saved.id, published ? "Published. Your homepage is updated locally." : "Draft saved.");
  }

  async function send(form: FormData, id: string, success: string) {
    setBusy(true); setError(""); setMessage("");
    try {
      const response = await fetch("/api/admin/work.json", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save this entry.");
      const next = result as WorkDocument;
      setDocument(next);
      select(next.posts.find((entry) => entry.id === id) ?? blank());
      setMessage(success);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to save. Please try again.");
    } finally { setBusy(false); }
  }

  async function remove() {
    if (!window.confirm(`Delete “${post.company}” from your work list?`)) return;
    const form = new FormData();
    form.set("operation", "delete");
    form.set("revision", String(document.revision));
    form.set("id", post.id);
    await send(form, post.id, "Entry deleted.");
  }

  async function reload() {
    try {
      const response = await fetch("/api/admin/work.json");
      if (!response.ok) throw new Error("Unable to reload the work list.");
      setDocument(await response.json());
      setMessage("Work list reloaded. Your unsaved fields are still here.");
      setError("");
    } catch (error) { setError(error instanceof Error ? error.message : "Unable to reload."); }
  }

  return (
    <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <form onSubmit={submit}>
        <fieldset disabled={busy} className="grid gap-6 disabled:opacity-60">
          <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
            <h2>{post.id ? "Edit work" : "New work"}</h2>
            <span className="text-sm text-[var(--app-fg-muted)]">{post.published ? "Published" : "Draft"}</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_7rem]">
            <label>Title<input className={inputClass} value={post.company} required maxLength={120} onChange={(event) => setPost({ ...post, company: event.target.value })} /></label>
            <label>Year<input className={inputClass} type="number" value={post.year} min={1900} max={2100} required onChange={(event) => setPost({ ...post, year: Number(event.target.value) })} /></label>
          </div>
          <label>Role or description<input className={inputClass} value={post.project ?? ""} maxLength={200} placeholder="e.g. Product Design" onChange={(event) => setPost({ ...post, project: event.target.value })} /></label>
          <label>Project link <span className="text-[var(--app-fg-muted)]">(optional)</span><input className={inputClass} type="url" value={post.href ?? ""} placeholder="https://" onChange={(event) => setPost({ ...post, href: event.target.value })} /></label>
          <div className="grid gap-3">
            <label>Image <span className="text-[var(--app-fg-muted)]">(optional)</span><input key={fileKey} className={`${inputClass} text-sm file:mr-4 file:border-0 file:bg-transparent file:text-[var(--app-accent)]`} type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setImage(event.target.files?.[0])} /></label>
            <p className="text-sm text-[var(--app-fg-muted)]">PNG, JPEG, or WebP, up to 10 MB. Images appear in the homepage gallery.</p>
            {(preview || post.image) && <>
              <img src={preview || post.image} alt={post.imageAlt || "Selected image preview"} className="max-h-80 w-full object-contain bg-[var(--app-border)]" />
              <button type="button" className="justify-self-start text-sm text-[var(--app-accent)]" onClick={() => { setPost({ ...post, image: "" }); setImage(undefined); setFileKey((key) => key + 1); }}>Remove image</button>
            </>}
          </div>
          <label>Image description<input className={inputClass} value={post.imageAlt ?? ""} maxLength={300} placeholder="Describe what is visible in the image" onChange={(event) => setPost({ ...post, imageAlt: event.target.value })} /></label>
          <label>Image caption<textarea className={inputClass} rows={3} maxLength={1000} value={post.caption ?? ""} onChange={(event) => setPost({ ...post, caption: event.target.value })} /></label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" value="publish" className="bg-[var(--app-accent)] px-5 py-3 text-[var(--app-bg)] hover:bg-[var(--app-accent-hover)]">{busy ? "Saving…" : "Publish"}</button>
            <button type="submit" value="draft" className="border border-[var(--app-border)] px-5 py-3">Save draft</button>
            {post.id && <button type="button" onClick={remove} className="ml-auto px-3 py-3 text-[var(--app-fg-muted)]">Delete</button>}
          </div>
          {post.published && <p className="text-sm text-[var(--app-fg-muted)]">Saving as a draft removes this entry from the homepage.</p>}
        </fieldset>
        {error && <p role="alert" className="mt-4 border-l-2 border-[var(--app-accent)] pl-3">{error}</p>}
        {message && <p role="status" className="mt-4 text-[var(--app-fg-muted)]">{message}</p>}
      </form>
      <aside className="grid gap-4">
        <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
          <h2>Work entries <span className="text-[var(--app-fg-muted)]">({document.posts.length})</span></h2>
          <button type="button" disabled={busy} onClick={() => select(blank())} className="text-[var(--app-accent)]">+ New</button>
        </div>
        <button type="button" disabled={busy} onClick={reload} className="justify-self-start text-sm text-[var(--app-fg-muted)]">Reload list</button>
        {document.posts.length === 0 && <p className="text-[var(--app-fg-muted)]">No work yet. Create your first entry.</p>}
        <ul>
          {[...document.posts].sort((a, b) => (b.year ?? 0) - (a.year ?? 0)).map((entry) => (
            <li key={entry.id} className="border-b border-[var(--app-border)]">
              <button type="button" disabled={busy} onClick={() => select(entry)} aria-current={post.id === entry.id ? "true" : undefined} className="flex w-full items-start justify-between gap-3 py-3 text-left aria-[current=true]:text-[var(--app-accent)]">
                <span>{entry.company}<span className="mt-1 block text-sm text-[var(--app-fg-muted)]">{entry.year} · {entry.project || "No description"}</span></span>
                <span className="text-xs text-[var(--app-fg-muted)]">{entry.published ? "Published" : "Draft"}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
