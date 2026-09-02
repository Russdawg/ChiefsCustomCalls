import type { Metadata } from "next";
import { getCategories, getHeroProducts } from "@/lib/catalog";
import HeroProductCard from "./_components/HeroProductCard";
import CategoryTile from "./_components/CategoryTile";

export const metadata: Metadata = {
  title: "Shop | Chief's Custom Calls",
  description:
    "Handcrafted turkey, duck, and deer calls, ready now or built to order.",
};

export default function ShopPage() {
  const heroProducts = getHeroProducts();
  const categories = getCategories();

  return (
    <>
      <section className="section on-dark">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="label">The shop</span>
            <h2>SIGNATURE CALLS</h2>
            <p>
              These five are what put Chief&rsquo;s on the map &mdash; always
              made to order, one at a time.
            </p>
          </div>
          <div className="hero-products-grid">
            {heroProducts.map((product) => (
              <HeroProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section ready">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="label">Browse the catalog</span>
            <h2>SHOP BY CATEGORY</h2>
            <p>
              Every category below is pulled straight from our live store.
              Pick one to see what&rsquo;s in stock right now.
            </p>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <CategoryTile key={category.id} category={category} />
            ))}
          </div>
          <p className="ready-note">
            Prices and availability are pulled from our live store catalog.
            Every purchase is completed securely on{" "}
            <a
              href="https://www.chiefscustomcalls.com/shop"
              target="_blank"
              rel="noopener noreferrer"
            >
              chiefscustomcalls.com/shop
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
