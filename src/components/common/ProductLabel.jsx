export default function ProductLabel({ product, fallback = '-', compact = false }) {
  if (!product) return fallback;

  return (
    <span className={`product-label${compact ? ' compact' : ''}`}>
      <span className="product-label-name">{product.name || fallback}</span>
      {product.description && (
        <span className="product-label-description">{product.description}</span>
      )}
    </span>
  );
}
