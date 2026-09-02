import Link from "next/link";
import Image from "next/image";
import type { CategoryWithSlug } from "@/lib/catalog";

export default function CategoryTile({
  category,
}: {
  category: CategoryWithSlug;
}) {
  return (
    <Link href={`/shop/${category.slug}`} className="category-tile">
      {category.image && (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 700px) 100vw, 50vw"
        />
      )}
      <h3>{category.name}</h3>
      <p>
        {category.description ||
          `${category.liveProductIds.length} piece${category.liveProductIds.length === 1 ? "" : "s"} available now`}
      </p>
      <span className="shoplink">Shop {category.name} →</span>
    </Link>
  );
}
