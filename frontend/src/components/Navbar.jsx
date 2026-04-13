import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { count } = useCart()
  const { pathname } = useLocation()

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>ShopFlow</Link>

        <div className={styles.links}>
          <Link to="/" className={pathname === '/' ? styles.active : ''}>Catálogo</Link>
          <Link to="/?tag=nuevo" className={styles.link}>Novedades</Link>
          <Link to="/?tag=oferta" className={styles.link}>Ofertas</Link>
        </div>

        <Link to="/carrito" className={styles.cartBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          {count > 0 && <span className={styles.badge}>{count}</span>}
        </Link>
      </div>
    </nav>
  )
}
