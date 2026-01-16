"use client"

import { useEffect, useState, use } from "react"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Minus, Plus, ShoppingCart, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { api, type Product } from "@/lib/api"
import { cn } from "@/lib/utils" 

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Fix for Next.js 15: Unwrap params using 'use'
  const { id } = use(params)

  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const { addToCart } = useCart()

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return
      try {
        const data = await api.getProduct(id)
        if (!data) {
          throw new Error("Product not found")
        }
        setProduct(data)
        setActiveImageIndex(0)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch product")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading details...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-8">{error || "Product not found"}</p>
        <Link href="/" className="text-primary hover:underline underline-offset-4">
          Return to Store
        </Link>
      </div>
    )
  }

  // Determine which images to show (Gallery or Fallback)
  const images = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image_url || "/placeholder.svg"]

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <nav className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium text-sm"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-6">
          <div className="relative aspect-square w-full bg-muted rounded-2xl overflow-hidden border border-border shadow-sm">
            <Image
              src={images[activeImageIndex]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              priority
            />
          </div>

          {/* Thumbnails Grid */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {images.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={cn(
                    "relative aspect-square w-full rounded-lg overflow-hidden border-2 transition-all",
                    index === activeImageIndex 
                      ? "border-primary ring-2 ring-primary/20" 
                      : "border-transparent hover:border-border"
                  )}
                >
                  <Image 
                    src={url || "/placeholder.svg"} 
                    alt={`${product.name} view ${index + 1}`} 
                    fill 
                    className="object-cover" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Details (Sticky on Desktop) */}
        <div className="flex flex-col h-fit lg:sticky lg:top-24">
          
          {/* Header Section */}
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-muted text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              {product.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-4">
              <p className="text-3xl font-bold text-secondary">
                ${product.price.toFixed(2)}
              </p>
              {/* Optional: Add comparison price logic here if needed */}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-border mb-6" />

          {/* Description */}
          {product.description && (
            <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Actions Section */}
          <div className="mt-auto space-y-6 bg-muted/30 p-6 rounded-xl border border-border/50">
            
            {/* Quantity Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-foreground font-medium">Quantity</span>
              <div className="flex items-center bg-background border border-border rounded-lg shadow-sm">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="p-3 text-muted-foreground hover:text-primary hover:bg-muted rounded-l-lg transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="p-3 text-muted-foreground hover:text-primary hover:bg-muted rounded-r-lg transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button 
              onClick={handleAddToCart} 
              className="coral-accent w-full py-7 text-lg font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-3"
            >
              <ShoppingCart size={20} />
              Add to Cart — ${(product.price * quantity).toFixed(2)}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Free shipping on orders over $50 • 30-day return policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}