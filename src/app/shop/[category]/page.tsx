import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug, getLiveProducts } from "@/lib/catalog";
import { getCustomProductsForCategory } from "@/lib/customProducts";
import ProductCard from "../_components/ProductCard";
import CustomProductCard from "../_components/CustomProductCard";

export function generateStaticParams() {
  return getCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.name} | Chief's Custom Calls`,
    description:
      category.description ||
      `Shop ${category.name} from Chief's Custom Calls.`,
  };
}

export default async function CategoryPage({
  params,
}: PageProps<"/shop/[category]">) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const products = getLiveProducts(category);
  const customProducts = getCustomProductsForCategory(category.slug);
  const hasProducts = products.length > 0 || customProducts.length > 0;

  return (
    <section className="section ready">
      <div className="wrap">
        <p className="breadcrumb">
          <Link href="/shop">Shop</Link> / {category.name}
        </p>
        <div className="section-head reveal">
          <span className="label">Category</span>
          <h2>{category.name.toUpperCase()}</h2>
          {category.description && <p>{category.description}</p>}
        </div>

        {hasProducts ? (
          <div className="product-grid reveal">
            {customProducts.map((product) => (
              <CustomProductCard key={product.id} product={product} />
            ))}
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="ready-note">
            Nothing&rsquo;s currently listed live in this category &mdash;
            check back soon, or browse the full store directly.
          </p>
        )}

        <p className="ready-note">
          Prices and stock shown here mirror our live store. Checkout happens
          securely on{" "}
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
  );
}
