import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { submitCheckout, formatPrice } from '../services/api'
import styles from './Checkout.module.css'

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', region: '',
    cardNumber: '', cardExpiry: '', cardCvc: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  if (items.length === 0 && !success) {
    navigate('/carrito')
    return null
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const required = ['name', 'email', 'address', 'city', 'cardNumber', 'cardExpiry', 'cardCvc']
    const missing = required.find(k => !form[k].trim())
    if (missing) { setError('Por favor completa todos los campos obligatorios.'); return }

    setLoading(true)
    try {
      const result = await submitCheckout({
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        customer: { name: form.name, email: form.email, phone: form.phone, address: `${form.address}, ${form.city}` },
        payment: { last4: form.cardNumber.slice(-4) },
      })
      setSuccess(result)
      clearCart()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className={styles.successWrap}>
        <div className={styles.successBox}>
          <div className={styles.successIcon}>✓</div>
          <h2>¡Pedido confirmado!</h2>
          <p>Número de pedido: <strong>{success.orderId}</strong></p>
          <p>Total pagado: <strong>{formatPrice(success.total)}</strong></p>
          <p className={styles.successSub}>Recibirás un email de confirmación en breve.</p>
          <button className={styles.successBtn} onClick={() => navigate('/')}>
            Volver al catálogo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.grid}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Datos personales</h2>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Nombre completo *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Tu nombre" />
                </div>
                <div className={styles.field}>
                  <label>Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" />
                </div>
              </div>
              <div className={styles.field}>
                <label>Teléfono</label>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+56 9 1234 5678" />
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Dirección de envío</h2>
              <div className={styles.field}>
                <label>Dirección *</label>
                <input name="address" value={form.address} onChange={handleChange} placeholder="Calle, número, depto" />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Ciudad *</label>
                  <input name="city" value={form.city} onChange={handleChange} placeholder="Santiago" />
                </div>
                <div className={styles.field}>
                  <label>Región</label>
                  <input name="region" value={form.region} onChange={handleChange} placeholder="Metropolitana" />
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Pago con tarjeta</h2>
              <div className={styles.field}>
                <label>Número de tarjeta *</label>
                <input
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Vencimiento *</label>
                  <input name="cardExpiry" value={form.cardExpiry} onChange={handleChange} placeholder="MM/AA" maxLength={5} />
                </div>
                <div className={styles.field}>
                  <label>CVC *</label>
                  <input name="cardCvc" value={form.cardCvc} onChange={handleChange} placeholder="123" maxLength={3} />
                </div>
              </div>
            </section>

            {error && <p className={styles.error}>{error}</p>}

            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? 'Procesando...' : `Confirmar pedido — ${formatPrice(total)}`}
            </button>
          </form>

          <div className={styles.orderSummary}>
            <h2 className={styles.sectionTitle}>Tu pedido</h2>
            {items.map(item => (
              <div key={item.cartId} className={styles.orderItem}>
                <img src={item.images[0]} alt={item.name} className={styles.orderImage} />
                <div className={styles.orderInfo}>
                  <p className={styles.orderName}>{item.name}</p>
                  <p className={styles.orderMeta}>{item.size} · {item.color} · x{item.quantity}</p>
                </div>
                <span className={styles.orderPrice}>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className={styles.orderTotal}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
