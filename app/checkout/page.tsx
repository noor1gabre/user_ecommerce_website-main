"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowLeft } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [formData, setFormData] = useState({ address: "", city: "" })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("Please upload a payment screenshot")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
      const itemsSummary = items.map((item) => `${item.name} x${item.quantity}`).join(", ")

      const formDataObj = new FormData()
      formDataObj.append("address", formData.address)
      formDataObj.append("items_summary", itemsSummary)
      formDataObj.append("total_price", total.toString())
      formDataObj.append("file", file)

      const token = localStorage.getItem("access_token")
      const response = await fetch(`${apiUrl}/api/v1/store/checkout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataObj,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Checkout failed")
      }

      const data = await response.json()
      clearCart()

      // Redirect to WhatsApp link
      if (data.whatsapp_link) {
        window.location.href = data.whatsapp_link
      } else {
        router.push("/")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
          <Link href="/">
            <Button className="teal-primary">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/cart" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
        <ArrowLeft size={20} />
        Back to Cart
      </Link>

      <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-lg p-8">
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
                <AlertCircle className="text-destructive flex-shrink-0" size={20} />
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street, Apt 4B"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">City</label>
                <Input name="city" value={formData.city} onChange={handleChange} placeholder="New York" required />
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground mb-4">Payment Method</h3>
                <p className="text-muted-foreground mb-4">Bank Transfer / Instapay</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Upload Payment Screenshot</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    {file ? (
                      <p className="text-primary font-medium">{file.name}</p>
                    ) : (
                      <div>
                        <p className="text-muted-foreground">Drag and drop your payment screenshot here</p>
                        <p className="text-sm text-muted-foreground mt-2">or click to select</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="coral-accent w-full py-6 text-lg">
                {loading ? "Processing..." : "Confirm & Chat with Admin"}
              </Button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-20">
          <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-foreground">
                  {item.name} x{item.quantity}
                </span>
                <span className="font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4">
            <div className="flex justify-between text-lg font-bold text-primary">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
