import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { fetchProduct, formatPrice } from '../services/api'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setSelectedSize(null)
    setSelectedColor(null)
    setSelectedImage(0)
    setAdded(false)
    fetchProduct(id)
      .then(d => { setProduct(d.product); setRelated(d.related) })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  function handleAdd() {
    if (!selectedSize) { setError('Selecciona una talla'); return }
    if (!selectedColor) { setError('Selecciona un color'); return }
    setError('')
    addItem(product, selectedSize, selectedColor)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return <div className={styles.loading}>Cargando...</div>
  if (!product) return null

  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discount = hasDiscount
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link to="/">Catálogo</Link>
          <span>/</span>
          <Link to={`/?category=${product.category}`}>{product.category}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className={styles.grid}>
          {/* Galería */}
          <div className={styles.gallery}>
            <img
              className={styles.mainImage}
              src={product.images[selectedImage]}
              alt={product.name}
            />
            {product.images.length > 1 && (
              <div className={styles.thumbnails}>
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className={`${styles.thumb} ${i === selectedImage ? styles.activeThumb : ''}`}
                    onClick={() => setSelectedImage(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className={styles.info}>
            <p className={styles.category}>{product.category}</p>
            <h1 className={styles.name}>{product.name}</h1>

            <div className={styles.ratingRow}>
              <span className={styles.stars}>{'★'.repeat(Math.round(product.rating))}</span>
              <span className={styles.ratingText}>{product.rating} ({product.reviews} reseñas)</span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.price}>{formatPrice(product.price)}</span>
              {hasDiscount && (
                <>
                  <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
                  <span className={styles.discount}>-{discount}%</span>
                </>
              )}
            </div>

            <p className={styles.description}>{product.description}</p>

            {/* Colores */}
            <div className={styles.optionGroup}>
              <p className={styles.optionLabel}>
                Color {selectedColor && <span className={styles.selected}>— {selectedColor}</span>}
              </p>
              <div className={styles.colorBtns}>
                {product.colors.map(c => (
                  <button
                    key={c}
                    className={`${styles.colorBtn} ${selectedColor === c ? styles.activeOption : ''}`}
                    onClick={() => setSelectedColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Tallas */}
            <div className={styles.optionGroup}>
              <p className={styles.optionLabel}>
                Talla {selectedSize && <span className={styles.selected}>— {selectedSize}</span>}
              </p>
              <div className={styles.sizeBtns}>
                {product.sizes.map(s => (
                  <button
                    key={s}
                    className={`${styles.sizeBtn} ${selectedSize === s ? styles.activeOption : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
              className={`${styles.addBtn} ${added ? styles.addedBtn : ''}`}
              onClick={handleAdd}
            >
              {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
            </button>

            <p className={styles.stock}>
              {product.stock > 10
                ? '✓ En stock'
                : product.stock > 0
                ? `⚠ Solo quedan ${product.stock} unidades`
                : '✗ Sin stock'}
            </p>
          </div>
        </div>

        {/* Relacionados */}
        {related.length > 0 && (
          <div className={styles.related}>
            <h2 className={styles.relatedTitle}>También te puede gustar</h2>
            <div className={styles.relatedGrid}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
