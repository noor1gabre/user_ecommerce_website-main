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
                <p className="text-foreground/60">On orders over R 100</p>
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

      <section id="products" className="py-20 md:py-32 px-4 container mx-auto relative">
        {/* Decorative background element */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[200%] h-96 bg-secondary/5 blur-[100px] -z-10 rounded-[100%]" />

        <div className="text-center mb-20 relative z-10">
          <div className="inline-block mb-4 animate-in fade-in zoom-in duration-700 delay-100 fill-mode-both">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-wider text-secondary uppercase bg-secondary/10 border border-secondary/20">
              Curated for you
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 fill-mode-both">
            Our Premium Collection
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary via-secondary to-primary rounded-full mx-auto mb-8 animate-in expand-w duration-1000 delay-300 fill-mode-both" />
          <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 fill-mode-both">
            Hand-picked pieces that combine elegance, comfort, and timeless design to elevate your living space.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20 min-h-[400px]">
            <div className="flex gap-2">
              <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
              <div className="w-4 h-4 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-12 rounded-xl bg-destructive/5 border border-destructive/20 p-6 max-w-lg mx-auto">
            <p className="text-destructive font-semibold flex items-center justify-center gap-2">
              <span className="text-2xl">⚠️</span> {error}
            </p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="space-y-20">
            {Object.entries(
              products.reduce((acc, product) => {
                const category = product.category || "Uncategorized";
                if (!acc[category]) acc[category] = [];
                acc[category].push(product);
                return acc;
              }, {} as Record<string, Product[]>)
            ).sort((a, b) => a[0].localeCompare(b[0])) // Sort categories alphabetically
              .map(([category, categoryProducts], categoryIndex) => (
                <div
                  key={category}
                  className="space-y-8 p-6 md:p-8 rounded-3xl bg-background/50 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-500 hover:bg-background/80"
                  style={{ animationDelay: `${categoryIndex * 0.1}s` }}
                >
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/30 pb-6">
                    <div>
                      <h3 className="text-3xl font-bold text-foreground relative inline-block">
                        {category}
                        <span className="absolute -bottom-6 left-0 w-1/3 h-1 bg-secondary/80 rounded-full" />
                      </h3>
                      <p className="text-foreground/50 mt-2 text-sm">Explore our finest selection of {category.toLowerCase()}</p>
                    </div>
                    <Link href={`/shop?category=${category}`} className="group/link text-sm font-bold text-primary hover:text-secondary uppercase tracking-wider flex items-center gap-2 transition-colors">
                      View All Products
                      <div className="bg-primary/10 p-2 rounded-full group-hover/link:bg-secondary/10 transition-colors">
                        <ArrowRight size={16} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                      </div>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {categoryProducts.slice(0, 5).map((product, index) => ( // Show only first 5
                      <div key={product.id} className="animate-in fade-in zoom-in duration-500 fill-mode-both hover:-translate-y-2 transition-transform duration-300" style={{ animationDelay: `${(categoryIndex * 0.1) + (index * 0.05)}s` }}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}

        {!loading && products.length === 0 && !error && (
          <div className="text-center py-20 rounded-3xl bg-muted/30 border border-border/50 p-12">
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="text-muted-foreground/50" size={40} />
            </div>
            <p className="text-foreground/60 text-xl font-medium">No products available at the moment.</p>
            <p className="text-foreground/40 mt-2">Please check back later for our new collection.</p>
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
