import type { Metadata } from "next";
import { isAuthed } from "@/lib/adminAuth";
import { getCategories } from "@/lib/catalog";
import LoginForm from "./_components/LoginForm";
import ProductForm from "./_components/ProductForm";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin | Chief's Custom Calls",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isAuthed();
  const categories = getCategories().map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <main className="admin-page">
      <div className="admin-card">
        <h1>Add a New Call</h1>
        <p className="admin-sub">
          Publishing here commits straight to the site&rsquo;s GitHub repo and
          triggers a live deploy &mdash; give it about a minute to show up on{" "}
          <code>/shop</code>.
        </p>
        {authed ? <ProductForm categories={categories} /> : <LoginForm />}
      </div>
    </main>
  );
}
