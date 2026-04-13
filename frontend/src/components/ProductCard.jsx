import { Link } from 'react-router-dom'
import { formatPrice } from '../services/api'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discount = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <Link to={`/producto/${product.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={product.images[0]}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
        {product.tags.includes('nuevo') && (
          <span className={styles.tagNew}>Nuevo</span>
        )}
        {hasDiscount && (
          <span className={styles.tagSale}>-{discount}%</span>
        )}
      </div>

      <div className={styles.info}>
        <p className={styles.category}>{product.category}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <div className={styles.rating}>
          <span className={styles.stars}>{'★'.repeat(Math.round(product.rating))}</span>
          <span className={styles.ratingCount}>({product.reviews})</span>
        </div>
      </div>
    </Link>
  )
}
