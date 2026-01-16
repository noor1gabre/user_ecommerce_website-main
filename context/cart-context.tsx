"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image_url?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: any) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        // Filter out any items that are null, undefined, or missing an ID
        const validItems = Array.isArray(parsedCart)
          ? parsedCart.filter((item: any) => item && item.id !== undefined && item.id !== null)
          : []
        setItems(validItems)
        // If we filtered out items, update localStorage immediately to clean it up
        if (Array.isArray(parsedCart) && validItems.length !== parsedCart.length) {
          localStorage.setItem("cart", JSON.stringify(validItems))
        }
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }
    setIsHydrated(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, isHydrated])

  const addToCart = (product: any) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image_url: product.image_url,
        },
      ]
    })
  }

  const removeFromCart = (productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    }
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
