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
  const [orderSuccess, setOrderSuccess] = useState<{ waLink: string | null } | null>(null)

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
        try {
          window.open(waLink, '_blank')
        } catch (e) { }
      }

      clearCart()
      setOrderSuccess({ waLink: waLink || null })

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

  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="bg-card w-full max-w-lg border border-border rounded-2xl p-8 lg:p-12 text-center shadow-xl">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-extrabold mb-4 text-foreground">Order Received!</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Thank you for your purchase. Your order has been placed successfully.
          </p>

          {orderSuccess.waLink ? (
            <div className="space-y-6">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-left">
                <p className="text-sm font-semibold text-amber-800 flex items-start gap-2">
                  <span className="text-xl">⚠️</span>
                  <span>Action Required: Please click the button below to send us your proof of payment on WhatsApp to complete your order.</span>
                </p>
              </div>
              <a
                href={orderSuccess.waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Message Admin on WhatsApp
              </a>
              <Button onClick={() => router.push("/orders")} variant="outline" className="w-full py-6 text-lg rounded-xl">
                View My Orders
              </Button>
            </div>
          ) : (
            <Button onClick={() => router.push("/orders")} className="w-full py-6 text-lg rounded-xl coral-accent mt-4">
              View My Orders
            </Button>
          )}
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
                      <span className="font-medium">Manual EFT</span>
                    </div>
                    <div className="text-sm text-foreground ml-8 mt-4 p-4 bg-background rounded border border-border">
                      <p className="font-semibold mb-2">Please transfer the total amount to the following bank account:</p>
                      <ul className="space-y-1 mb-4 text-muted-foreground">
                        <li><strong className="text-foreground font-medium">Bank:</strong> TymeBank</li>
                        <li><strong className="text-foreground font-medium">Account Name:</strong> Diaa Ahmed</li>
                        <li><strong className="text-foreground font-medium">Account Number:</strong> 5107 0831 929</li>
                        <li><strong className="text-foreground font-medium">Branch Code:</strong> 678910</li>
                        <li><strong className="text-foreground font-medium">Account Type:</strong> EveryDay account</li>
                      </ul>
                      <p className="text-primary font-medium">Once transferred, please upload your proof of payment below.</p>
                    </div>
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
