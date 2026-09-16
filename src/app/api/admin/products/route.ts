import { NextRequest, NextResponse } from "next/server";
import { isAuthed } from "@/lib/adminAuth";
import { getJsonFile, putFile } from "@/lib/github";
import { makeCustomProductId, type CustomProduct } from "@/lib/customProducts";
import { getCategories } from "@/lib/catalog";

const CUSTOM_PRODUCTS_PATH = "src/data/custom-products.json";
const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3MB/file -- stays well under Vercel's request body cap
const MAX_IMAGES = 4;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function extensionFor(type: string): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

export async function POST(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission" }, { status: 400 });
  }

  const name = String(form.get("name") || "").trim();
  const priceRaw = String(form.get("price") || "").trim();
  const description = String(form.get("description") || "").trim();
  const categorySlug = String(form.get("categorySlug") || "").trim();
  const images = form.getAll("images").filter((v): v is File => v instanceof File && v.size > 0);

  if (!name) {
    return NextResponse.json({ error: "Product name is required" }, { status: 400 });
  }
  const price = Number(priceRaw);
  if (!Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ error: "Enter a valid price" }, { status: 400 });
  }
  const validCategory = getCategories().some((c) => c.slug === categorySlug);
  if (!validCategory) {
    return NextResponse.json({ error: "Choose a valid category" }, { status: 400 });
  }
  if (images.length === 0) {
    return NextResponse.json({ error: "Add at least one photo" }, { status: 400 });
  }
  if (images.length > MAX_IMAGES) {
    return NextResponse.json(
      { error: `Please upload at most ${MAX_IMAGES} photos` },
      { status: 400 }
    );
  }
  for (const image of images) {
    if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
      return NextResponse.json(
        { error: `Unsupported image type: ${image.type || "unknown"}. Use JPG, PNG, or WebP.` },
        { status: 400 }
      );
    }
    if (image.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: `${image.name} is too large. Keep each photo under 3MB.` },
        { status: 400 }
      );
    }
  }

  const id = makeCustomProductId(name);

  let imagePaths: string[];
  try {
    imagePaths = await Promise.all(
      images.map(async (image, index) => {
        const buffer = Buffer.from(await image.arrayBuffer());
        const ext = extensionFor(image.type);
        const publicPath = `products/custom/${id}/${index + 1}.${ext}`;
        await putFile(
          `public/${publicPath}`,
          buffer.toString("base64"),
          `Add photo ${index + 1} for ${name}`
        );
        return `/${publicPath}`;
      })
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Failed to upload photos: ${err instanceof Error ? err.message : err}` },
      { status: 502 }
    );
  }

  try {
    let existing: CustomProduct[] = [];
    try {
      existing = await getJsonFile<CustomProduct[]>(CUSTOM_PRODUCTS_PATH);
    } catch {
      // File may not exist yet on a fresh checkout; start from empty.
      existing = [];
    }

    const newProduct: CustomProduct = {
      id,
      name,
      price,
      description,
      categorySlug,
      images: imagePaths,
      createdAt: new Date().toISOString(),
    };

    const updated = [...existing, newProduct];
    const contentBase64 = Buffer.from(JSON.stringify(updated, null, 2) + "\n", "utf-8").toString(
      "base64"
    );
    await putFile(CUSTOM_PRODUCTS_PATH, contentBase64, `Add product: ${name}`);

    return NextResponse.json({ ok: true, product: newProduct });
  } catch (err) {
    return NextResponse.json(
      { error: `Photos uploaded, but saving the product listing failed: ${err instanceof Error ? err.message : err}` },
      { status: 502 }
    );
  }
}
