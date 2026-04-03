import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.75rem", color: "#E8E8E8", marginBottom: "0.25rem" }}>
          Add New Product
        </h1>
        <p style={{ color: "#666", fontSize: "0.875rem" }}>Fill in the details to add a new jewelry product to your catalog.</p>
      </div>
      <ProductForm mode="new" />
    </div>
  );
}
