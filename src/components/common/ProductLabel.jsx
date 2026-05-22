export default function ProductLabel({ product, fallback = '-', compact = false, showDescription = true }) {
  if (!product) return fallback;

  return (
    <span className={`product-label${compact ? ' compact' : ''}`}>
      <span className="product-label-name">{product.name || fallback}</span>
      {showDescription && product.description && (
        <span className="product-label-description">{product.description}</span>
      )}
    </span>
  );
}
