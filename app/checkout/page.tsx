"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowLeft } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import LocationPicker to avoid SSR issues with Leaflet (window is not defined)
const LocationPicker = dynamic(
  () => import("@/components/ui/location-picker"),
  {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>
  }
)
import { type AddressData } from "@/components/ui/location-picker"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [formData, setFormData] = useState({
    street: "",
    local_area: "",
    city: "",
    province: "Gauteng",
    postal_code: "",
    country: "South Africa",
    lat: 0,
    lng: 0
  })

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // const [paymentMethod, setPaymentMethod] = useState<'manual' | 'payfast'>('payfast') // Removed

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAddressFound = (address: AddressData) => {
    setFormData({
      ...formData,
      street: address.street_address,
      local_area: address.local_area,
      city: address.city,
      province: address.province,
      postal_code: address.postal_code,
      country: address.country, // Should default to SA
      lat: address.lat,
      lng: address.lng
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!file) {
      setError("Please upload a payment receipt.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
      const itemsSummary = items.map((item) => `${item.name} x${item.quantity}`).join(", ")

      // Serialize address data to JSON for backend processing
      const addressJson = JSON.stringify({
        street_address: formData.street,
        local_area: formData.local_area,
        city: formData.city,
        province: formData.province,
        postal_code: formData.postal_code,
        country: formData.country,
        lat: formData.lat,
        lng: formData.lng
      })

      const formDataObj = new FormData()
      formDataObj.append("address", addressJson)
      formDataObj.append("items_summary", itemsSummary)
      formDataObj.append("total_price", total.toString())
      formDataObj.append("payment_method", "manual")
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

      // Manual Flow Success
      const waLink = data.whatsapp_link
      if (waLink) {
        window.open(waLink, '_blank')
      }

      clearCart()
      router.push("/orders")

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

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Delivery Location</h3>
                <p className="text-sm text-muted-foreground mb-3">Please select your delivery location on the map.</p>
                <LocationPicker onAddressFound={handleAddressFound} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">Street Address</label>
                  <Input
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="123 Main Street, Apt 4B"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Suburb / Local Area</label>
                  <Input
                    name="local_area"
                    value={formData.local_area}
                    onChange={handleChange}
                    placeholder="e.g. Menlo Park"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">City</label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Cape Town"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Province</label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="Gauteng">Gauteng</option>
                    <option value="Western Cape">Western Cape</option>
                    <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                    <option value="Eastern Cape">Eastern Cape</option>
                    <option value="Free State">Free State</option>
                    <option value="Limpopo">Limpopo</option>
                    <option value="Mpumalanga">Mpumalanga</option>
                    <option value="North West">North West</option>
                    <option value="Northern Cape">Northern Cape</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Postal Code</label>
                  <Input
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    placeholder="e.g. 8000"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                  <Input
                    name="country"
                    value="South Africa"
                    disabled
                    className="bg-muted text-muted-foreground"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-semibold text-foreground mb-4">Payment Method</h3>
                <div className="grid grid-cols-1 gap-4">
                  {/* Manual / EFT Option Only */}
                  <div className={`p-4 border rounded-lg cursor-pointer transition-colors border-primary bg-primary/5`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center border-primary`}>
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      </div>
                      <span className="font-medium">Bank Transfer / Instapay</span>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8 mt-1">Please upload your proof of payment below.</p>
                  </div>
                </div>
              </div>

              {/* File Upload Always Visible */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Upload Payment Receipt <span className="text-destructive">*</span></label>
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
                      <div className="flex flex-col items-center">
                        <p className="text-primary font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">Click to change</p>
                      </div>
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
                {loading ? "Processing..." : "Confirm & Place Order"}
              </Button>
            </form>
          </div>
        </div>

        {/* Order Summary s*/}
        <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-20">
          <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-foreground">
                  {item.name} x{item.quantity}
                </span>
                <span className="font-medium text-foreground">R {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-4">
            <div className="flex justify-between text-lg font-bold text-primary">
              <span>Total</span>
              <span>R {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
