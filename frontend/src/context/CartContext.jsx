import { createContext, useContext, useReducer } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const exists = state.find(i =>
        i.id === action.item.id &&
        i.size === action.item.size &&
        i.color === action.item.color
      )
      if (exists) {
        return state.map(i =>
          i.id === action.item.id && i.size === action.item.size && i.color === action.item.color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...state, { ...action.item, quantity: 1 }]
    }
    case 'REMOVE':
      return state.filter(i => i.cartId !== action.cartId)
    case 'UPDATE_QTY':
      return state.map(i =>
        i.cartId === action.cartId ? { ...i, quantity: action.qty } : i
      ).filter(i => i.quantity > 0)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [])

  function addItem(product, size, color) {
    const cartId = `${product.id}-${size}-${color}`
    dispatch({ type: 'ADD', item: { ...product, size, color, cartId } })
  }

  function removeItem(cartId) {
    dispatch({ type: 'REMOVE', cartId })
  }

  function updateQty(cartId, qty) {
    dispatch({ type: 'UPDATE_QTY', cartId, qty })
  }

  function clearCart() {
    dispatch({ type: 'CLEAR' })
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
