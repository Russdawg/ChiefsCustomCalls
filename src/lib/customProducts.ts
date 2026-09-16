import rawCustomProducts from "@/data/custom-products.json";
import { slugify } from "@/lib/catalog";

// Products added through /admin, independent of the Duda catalog import.
// These don't have a Duda store listing, so they check out directly via
// PayPal (see PayPalButtons) instead of linking out to chiefscustomcalls.com.

export type CustomProduct = {
  id: string;
  name: string;
  price: number;
  description: string;
  /** Slug of the shop category this product should appear under. */
  categorySlug: string;
  /** Paths under /public, e.g. "/products/custom/<id>/photo-1.jpg". */
  images: string[];
  createdAt: string;
};

const customProducts = rawCustomProducts as CustomProduct[];

export function getAllCustomProducts(): CustomProduct[] {
  return customProducts;
}

export function getCustomProductsForCategory(categorySlug: string): CustomProduct[] {
  return customProducts.filter((p) => p.categorySlug === categorySlug);
}

export function makeCustomProductId(name: string): string {
  const base = slugify(name);
  const suffix = Date.now().toString(36);
  return `${base}-${suffix}`;
}
