import { db } from "@/lib/mockDb";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = db.products.findById(id);
  if (!product) notFound();

  const initialData = {
    id: product.id,
    name: product.name,
    category: product.category,
    typeId: product.typeId,
    weight: product.weight.toString(),
    purity: product.purity,
    quantity: product.quantity.toString(),
    purchasePrice: product.purchasePrice.toString(),
    salePrice: product.salePrice?.toString() ?? "",
    discountPrice: product.discountPrice?.toString() ?? "",
    makingCharges: product.makingCharges.toString(),
    occasion: product.occasion as string[],
    description: product.description ?? "",
    videoUrl: product.videoUrl ?? "",
    isFeatured: product.isFeatured,
    imageIds: product.images.map((img) => img.publicId),
    imageUrls: product.images.map((img) => img.url),
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", color: "#E8E8E8", marginBottom: "0.25rem" }}>
          Edit Product
        </h1>
        <p style={{ color: "#666", fontSize: "0.875rem" }}>
          Update the details for <span style={{ color: "#C9A84C" }}>{product.name}</span>.
        </p>
      </div>
      <ProductForm mode="edit" initialData={initialData} />
    </div>
  );
}
