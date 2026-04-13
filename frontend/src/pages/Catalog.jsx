import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts, fetchCategories } from '../services/api'
import ProductCard from '../components/ProductCard'
import styles from './Catalog.module.css'

const SORT_OPTIONS = [
  { value: '', label: 'Relevancia' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor valorados' },
]

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const category = searchParams.get('category') || ''
  const sort = searchParams.get('sort') || ''
  const tag = searchParams.get('tag') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  useEffect(() => {
    fetchCategories().then(d => setCategories(d.categories))
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchProducts({ category, sort, tag, maxPrice })
      .then(d => { setProducts(d.products); setTotal(d.total) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [category, sort, tag, maxPrice])

  function setFilter(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>Categoría</h3>
          <button
            className={`${styles.filterBtn} ${!category ? styles.active : ''}`}
            onClick={() => setFilter('category', '')}
          >
            Todas
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${category === cat ? styles.active : ''}`}
              onClick={() => setFilter('category', cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>Precio máximo</h3>
          {[30000, 50000, 80000, 120000].map(p => (
            <button
              key={p}
              className={`${styles.filterBtn} ${maxPrice === String(p) ? styles.active : ''}`}
              onClick={() => setFilter('maxPrice', maxPrice === String(p) ? '' : p)}
            >
              Hasta ${(p / 1000).toFixed(0)}.000
            </button>
          ))}
        </div>

        <div className={styles.filterGroup}>
          <h3 className={styles.filterTitle}>Colección</h3>
          {['nuevo', 'destacado', 'oferta'].map(t => (
            <button
              key={t}
              className={`${styles.filterBtn} ${tag === t ? styles.active : ''}`}
              onClick={() => setFilter('tag', tag === t ? '' : t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.topBar}>
          <p className={styles.count}>{total} producto{total !== 1 ? 's' : ''}</p>
          <select
            className={styles.sort}
            value={sort}
            onChange={e => setFilter('sort', e.target.value)}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className={styles.loading}>Cargando productos...</div>
        ) : products.length === 0 ? (
          <div className={styles.empty}>No hay productos con estos filtros.</div>
        ) : (
          <div className={styles.grid}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
    </div>
  )
}
