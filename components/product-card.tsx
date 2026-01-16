"use client"

import Link from "next/link"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ShoppingBag, Heart } from "lucide-react"
import { useState } from "react"

interface Product {
  id: number
  name: string
  price: number
  category: string
  description?: string
  image_url?: string
  gallery?: string[]
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  // Guard clause: if product hasn't loaded properly or missing ID, don't render to avoid broken links
  if (!product || !product.id) return null;

  const [isWishlisted, setIsWishlisted] = useState(false)
  const images =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image_url || "/placeholder.svg"]
  const [activeIndex, setActiveIndex] = useState(0)
  const hasMultiple = images.length > 1

  return (
    <div className="group h-full">
      <div className="bg-card rounded-2xl overflow-hidden border border-border/40 hover:border-secondary/40 transition-all duration-500 hover:shadow-2xl h-full flex flex-col hover:shadow-secondary/20">
        <div className="px-4 pt-4">
          <Link href={`/product/${product.id}`}>
            <div className="relative h-64 w-full bg-muted overflow-hidden cursor-pointer rounded-xl">
              <Image
                src={images[activeIndex]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {hasMultiple && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-1.5 text-xs"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setActiveIndex((prev) => (prev + 1) % images.length)
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white rounded-full p-1.5 text-xs"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-2 right-2 rounded-full bg-black/70 text-white text-[10px] px-2 py-1">
                    {activeIndex + 1}/{images.length}
                  </div>
                </>
              )}
            </div>
          </Link>
          {hasMultiple && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((src, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`relative w-14 h-14 rounded-md overflow-hidden border ${index === activeIndex ? "border-secondary" : "border-border/50"
                    } flex-shrink-0`}
                >
                  <Image src={src || "/placeholder.svg"} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 pt-4 flex flex-col flex-grow">
          <span className="inline-flex px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold tracking-wide mb-3">
            {product.category}
          </span>

          <Link href={`/product/${product.id}`}>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer mb-2 line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {product.description || "Premium quality piece crafted for modern living spaces."}
          </p>

          <div className="flex items-baseline justify-between gap-2 mb-6 mt-auto">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-muted-foreground">incl. taxes</span>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => addToCart(product)}
              className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg font-semibold py-3 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/30 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              Add
            </Button>
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-3 rounded-lg border transition-all duration-300 ${isWishlisted
                  ? "bg-secondary/10 border-secondary text-secondary"
                  : "border-border/40 text-foreground/50 hover:border-secondary/30 hover:text-secondary"
                }`}
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
