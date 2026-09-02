import Image from "next/image";
import type { Product } from "@/lib/catalog";
import { isSoldOut } from "@/lib/catalog";

function formatPrice(price: number | null) {
  if (price === null) return "Price on request";
  return `$${price.toFixed(2)}`;
}

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const soldOut = isSoldOut(product);

  return (
    <article className={`product-card${soldOut ? " is-sold-out" : ""}`}>
      {soldOut && <span className="badge-soldout">Sold Out</span>}
      <div className="product-shot">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || product.name}
            width={400}
            height={400}
          />
        ) : null}
      </div>
      <h3>{product.name}</h3>
      <span className="price">{formatPrice(product.price)}</span>
      <a
        className="btn btn-outline-dark"
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {soldOut ? "View on our store →" : "Buy on our store →"}
      </a>
    </article>
  );
}
