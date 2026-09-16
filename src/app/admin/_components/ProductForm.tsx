"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type CategoryOption = { slug: string; name: string };

export default function ProductForm({ categories }: { categories: CategoryOption[] }) {
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setStatus("idle");
        return;
      }
      setLastAdded(data.product?.name ?? "Product");
      setStatus("done");
      formRef.current?.reset();
    } catch {
      setError("Network error, try again");
      setStatus("idle");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div>
      <div className="admin-toolbar">
        <button className="btn btn-outline-dark" onClick={handleLogout} type="button">
          Log out
        </button>
      </div>

      {status === "done" && (
        <p className="admin-success">
          &ldquo;{lastAdded}&rdquo; is committed &mdash; it&rsquo;ll be live on the
          site in about a minute once the deploy finishes.{" "}
          <button
            type="button"
            className="admin-link-button"
            onClick={() => setStatus("idle")}
          >
            Add another
          </button>
        </p>
      )}

      {status !== "done" && (
        <form className="admin-form" ref={formRef} onSubmit={handleSubmit}>
          <label>
            Call name
            <input type="text" name="name" required placeholder="e.g. Osage Deep Creek" />
          </label>

          <label>
            Price (USD)
            <input type="number" name="price" required min="0" step="0.01" placeholder="99.99" />
          </label>

          <label>
            Category
            <select name="categorySlug" required defaultValue="">
              <option value="" disabled>
                Choose a category
              </option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Description
            <textarea name="description" rows={4} placeholder="What makes this call special?" />
          </label>

          <label>
            Photos (JPG/PNG/WebP, up to 4, 3MB each)
            <input type="file" name="images" accept="image/jpeg,image/png,image/webp" multiple required />
          </label>

          {error && <p className="admin-error">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={status === "saving"}>
            {status === "saving" ? "Publishing…" : "Publish Product"}
          </button>
        </form>
      )}
    </div>
  );
}
