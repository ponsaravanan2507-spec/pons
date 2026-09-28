// Shows a real photo if `image` is set on the data item, otherwise the emoji.
export default function Visual({ item, alt }) {
  return item.image ? <span className="visual" style={{ width: '100%', height: '100%' }}><img src={item.image} alt={alt || item.name} loading="lazy" /></span> : <span role="img" aria-label={alt || item.name}>{item.emoji}</span>;
}
