import rawCatalog from "@/data/catalog.json";

// Data pulled from the Duda store's product-catalog export (Store Management
// > Product Catalog > Export). See scripts/parse-catalog notes in the repo
// history for how src/data/catalog.json is generated from that CSV.

export type ProductImage = {
  url: string;
  alt: string;
};

export type ProductOptionValue = {
  value: string;
  markup: number;
  isDefault: boolean;
  swatchHex: string | null;
};

export type ProductOption = {
  name: string;
  type: string;
  required: boolean;
  values: ProductOptionValue[];
};

export type ProductVariation = {
  price: number | null;
  image: string | null;
  options: Record<string, string>;
  url: string;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  price: number | null;
  compareToPrice: number | null;
  /** Currently published on the live Duda storefront. */
  isLive: boolean;
  /** One of the five uncategorized signature calls — always shown regardless of isLive. */
  isHero: boolean;
  isFeatured: boolean;
  featuredOrder: number | null;
  isInventoryTracked: boolean;
  quantity: number | null;
  images: ProductImage[];
  description: string;
  descriptionHtml: string;
  categoryName: string | null;
  seoTitle: string;
  seoDescription: string;
  relatedItemIds: string[];
  /** Product page on chiefscustomcalls.com — checkout happens there. */
  url: string;
  options: ProductOption[];
  variations: ProductVariation[];
};

export type Category = {
  id: string;
  name: string;
  description: string;
  image: string | null;
  order: number | null;
  url: string;
  productIds: string[];
  liveProductIds: string[];
};

export type Catalog = {
  categories: Category[];
  products: Product[];
  heroProductIds: string[];
  uncategorizedProductIds: string[];
};

export type CategoryWithSlug = Category & { slug: string };

const catalog = rawCatalog as Catalog;

const productsById = new Map(catalog.products.map((p) => [p.id, p]));

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getCategories(): CategoryWithSlug[] {
  return catalog.categories
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((category) => ({ ...category, slug: slugify(category.name) }));
}

export function getCategoryBySlug(slug: string): CategoryWithSlug | null {
  return getCategories().find((category) => category.slug === slug) ?? null;
}

export function getProductById(id: string): Product | undefined {
  return productsById.get(id);
}

function resolveProducts(ids: string[]): Product[] {
  return ids
    .map((id) => productsById.get(id))
    .filter((p): p is Product => Boolean(p));
}

/** Products currently published on the live storefront for a category. */
export function getLiveProducts(category: Category): Product[] {
  return resolveProducts(category.liveProductIds);
}

/** The five signature calls kept on the site as evergreen hero pieces. */
export function getHeroProducts(): Product[] {
  return resolveProducts(catalog.heroProductIds);
}

/**
 * Some live listings are shown "Sold Out" rather than hidden -- Duda keeps
 * them on the page with quantity 0 (verified against Hedge Glass Pot Call /
 * Padauk Slate Call, both live but out of stock).
 */
export function isSoldOut(product: Product): boolean {
  return product.isInventoryTracked && (product.quantity ?? 0) <= 0;
}
