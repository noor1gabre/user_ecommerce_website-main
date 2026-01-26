"use client"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trash2, ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Add some beautiful items to get started!</p>
          <Link href="/">
            <Button className="teal-primary">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
        <ArrowLeft size={20} />
        Continue Shopping
      </Link>

      <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => {
              if (!item || !item.id) return null
              return (
                <div key={item.id} className="bg-card border border-border rounded-lg p-6 flex gap-4">
                  {item.image_url && (
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                    <p className="text-primary font-bold text-lg mb-4">R {item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-border rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-muted"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 border-l border-r border-border">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-muted"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-destructive hover:opacity-70"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-20">
          <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-foreground">
              <span>Subtotal</span>
              <span>R {total.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex justify-between text-lg font-bold text-primary">
                <span>Total</span>
                <span>R {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <Link href="/checkout">
            <Button className="coral-accent w-full py-6">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
