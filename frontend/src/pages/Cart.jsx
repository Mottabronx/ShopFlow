import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../services/api'
import styles from './Cart.module.css'

export default function Cart() {
  const { items, removeItem, updateQty, total, count } = useCart()

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyIcon}>🛍</p>
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos para continuar.</p>
        <Link to="/" className={styles.backBtn}>Ver catálogo</Link>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Carrito ({count} {count === 1 ? 'producto' : 'productos'})</h1>

        <div className={styles.grid}>
          <div className={styles.items}>
            {items.map(item => (
              <div key={item.cartId} className={styles.item}>
                <img src={item.images[0]} alt={item.name} className={styles.itemImage} />
                <div className={styles.itemInfo}>
                  <p className={styles.itemCategory}>{item.category}</p>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemMeta}>{item.size} · {item.color}</p>
                  <div className={styles.itemBottom}>
                    <div className={styles.qtyControl}>
                      <button onClick={() => updateQty(item.cartId, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(item.cartId, item.quantity + 1)}>+</button>
                    </div>
                    <span className={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
                <button className={styles.removeBtn} onClick={() => removeItem(item.cartId)} title="Eliminar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Resumen</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Envío</span>
              <span className={styles.freeShipping}>Gratis</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <Link to="/checkout" className={styles.checkoutBtn}>
              Ir al checkout
            </Link>
            <Link to="/" className={styles.continueBtn}>
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
