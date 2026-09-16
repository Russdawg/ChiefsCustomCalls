import Image from "next/image";
import type { CustomProduct } from "@/lib/customProducts";
import PayPalButtons from "./PayPalButtons";

export default function CustomProductCard({ product }: { product: CustomProduct }) {
  const image = product.images[0];

  return (
    <article className="product-card">
      <span className="badge-new">New</span>
      <div className="product-shot">
        {image ? (
          <Image src={image} alt={product.name} width={400} height={400} />
        ) : null}
      </div>
      <h3>{product.name}</h3>
      <span className="price">${product.price.toFixed(2)}</span>
      {product.description && (
        <p className="product-card-desc">{product.description}</p>
      )}
      <PayPalButtons
        productId={product.id}
        name={product.name}
        price={product.price}
      />
    </article>
  );
}
