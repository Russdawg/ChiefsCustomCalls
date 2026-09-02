import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/catalog";

// The five signature calls (Porter, Original Pot, Tracker, Custom Hybrid
// Pot, The Bonzer) don't have a live, orderable Duda product page right
// now -- their base listing is unpublished even though the calls
// themselves are the brand's evergreen, always-makeable pieces. Point the
// CTA at the homepage's custom-order section instead of a dead link.
export default function HeroProductCard({ product }: { product: Product }) {
  const image = product.images[0];

  return (
    <article className="hero-product-card">
      <span className="signature-tag">Signature Call</span>
      <div className="product-shot">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || product.name}
            width={360}
            height={360}
          />
        ) : null}
      </div>
      <h3>{product.name}</h3>
      <span className="price">from ${product.price?.toFixed(2)}</span>
      <Link className="btn btn-outline" href="/#custom">
        Inquire About This Call →
      </Link>
    </article>
  );
}
