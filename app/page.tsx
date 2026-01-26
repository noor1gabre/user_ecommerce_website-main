"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { api, type Product } from "@/lib/api"
import ProductCard from "@/components/product-card"
import { Sparkles, Truck, Shield, ArrowRight } from "lucide-react"



export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await api.getProducts()
        setProducts(data)
      } catch (err) {
        setError("Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden h-screen min-h-[600px] flex items-center justify-center">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/hero.webp"
            className="w-full h-full object-cover"
          >
            <source src="/hero.webm" type="video/webm" />
            {/* Fallback for browsers that don't support video */}
            <img src="/hero.webp" alt="Hero Background" className="w-full h-full object-cover" />
          </video>
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="container mx-auto relative z-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both" style={{ animationDelay: "100ms" }}>
              <Sparkles size={16} className="text-secondary" />
              <span className="text-sm font-semibold text-secondary">Discover Premium Quality</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-foreground drop-shadow-sm animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both" style={{ animationDelay: "300ms" }}>
              <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Transform Your Space
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-foreground/80 mb-10 leading-relaxed max-w-2xl mx-auto font-medium animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both" style={{ animationDelay: "600ms" }}>
              Discover carefully curated furniture and home decor that brings comfort, style, and elegance to every
              corner of your home.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both" style={{ animationDelay: "900ms" }}>
              <Link href="/shop">
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-12 py-7 text-xl rounded-full font-bold flex items-center gap-3 transition-all duration-300 hover:shadow-2xl hover:shadow-secondary/40 hover:-translate-y-1 hover:scale-105 active:scale-95">
                  Shop Now
                  <ArrowRight size={24} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories - Visual Attraction */}
      <section className="py-10 px-4 -mt-10 relative z-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/shop" className="group relative h-64 rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/40 mix-blend-multiply z-10 transition-opacity duration-300 group-hover:opacity-90" />
              <img src="/modern-furniture-showroom.png" alt="Living Room" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white p-4 text-center">
                <h3 className="text-2xl font-bold mb-2 transform translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">Living Room</h3>
                <span className="px-4 py-2 border border-white/30 rounded-full text-sm font-medium backdrop-blur-md bg-white/10 transform translate-y-8 opacity-0 transition-all duration-500 delay-100 group-hover:translate-y-0 group-hover:opacity-100">Explore Collection</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <h3 className="text-2xl font-bold text-white group-hover:opacity-0 transition-opacity duration-300">Living Room</h3>
              </div>
            </Link>

            <Link href="/shop" className="group relative h-64 rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/80 to-secondary/40 mix-blend-multiply z-10 transition-opacity duration-300 group-hover:opacity-90" />
              <img src="/hero.webp" alt="Bedroom" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white p-4 text-center">
                <h3 className="text-2xl font-bold mb-2 transform translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">Bedroom</h3>
                <span className="px-4 py-2 border border-white/30 rounded-full text-sm font-medium backdrop-blur-md bg-white/10 transform translate-y-8 opacity-0 transition-all duration-500 delay-100 group-hover:translate-y-0 group-hover:opacity-100">Explore Collection</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <h3 className="text-2xl font-bold text-white group-hover:opacity-0 transition-opacity duration-300">Bedroom</h3>
              </div>
            </Link>

            <Link href="/shop" className="group relative h-64 rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 to-slate-600/40 mix-blend-multiply z-10 transition-opacity duration-300 group-hover:opacity-90" />
              <img src="/placeholder.jpg" alt="Home Office" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white p-4 text-center">
                <h3 className="text-2xl font-bold mb-2 transform translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">Home Office</h3>
                <span className="px-4 py-2 border border-white/30 rounded-full text-sm font-medium backdrop-blur-md bg-white/10 transform translate-y-8 opacity-0 transition-all duration-500 delay-100 group-hover:translate-y-0 group-hover:opacity-100">Explore Collection</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <h3 className="text-2xl font-bold text-white group-hover:opacity-0 transition-opacity duration-300">Home Office</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-background border-y border-border/40">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group flex items-center gap-4 p-6 rounded-2xl transition-all duration-300 hover:bg-secondary/5 hover:shadow-lg hover:-translate-y-1 cursor-default">
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-secondary/20 group-hover:scale-110">
                <Truck className="text-secondary" size={28} />
              </div>
              <div>
                <p className="font-bold text-lg text-foreground mb-1">Free Shipping</p>
                <p className="text-foreground/60">On orders over $100</p>
              </div>
            </div>
            <div className="group flex items-center gap-4 p-6 rounded-2xl transition-all duration-300 hover:bg-primary/5 hover:shadow-lg hover:-translate-y-1 cursor-default">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                <Shield className="text-primary" size={28} />
              </div>
              <div>
                <p className="font-bold text-lg text-foreground mb-1">Secure Payment</p>
                <p className="text-foreground/60">100% safe transactions</p>
              </div>
            </div>
            <div className="group flex items-center gap-4 p-6 rounded-2xl transition-all duration-300 hover:bg-secondary/5 hover:shadow-lg hover:-translate-y-1 cursor-default">
              <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-secondary/20 group-hover:scale-110">
                <Sparkles className="text-secondary" size={28} />
              </div>
              <div>
                <p className="font-bold text-lg text-foreground mb-1">Premium Quality</p>
                <p className="text-foreground/60">Carefully selected items</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="py-20 md:py-32 px-4 container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Premium Collection</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Hand-picked pieces that combine elegance, comfort, and timeless design.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex gap-2">
              <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
              <div className="w-4 h-4 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-12 rounded-xl bg-destructive/10 border border-destructive/20 p-6">
            <p className="text-destructive font-semibold">{error}</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && !error && (
          <div className="text-center py-12 rounded-xl bg-muted/50 p-8">
            <p className="text-foreground/60 text-lg">No products available at the moment.</p>
          </div>
        )}
      </section>

      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 -z-10 animate-shimmer" />

        <div className="container mx-auto max-w-2xl text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Transform Your Home?</h3>
          <p className="text-lg text-foreground/70 mb-8">
            Explore our full collection and find the perfect pieces for your space.
          </p>
          <Link href="#products">
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-10 py-6 text-lg rounded-full font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-secondary/30 hover:-translate-y-1">
              Start Shopping
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
