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
      <section className="relative overflow-hidden py-20 md:py-32 px-4">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/30 mb-6">
              <Sparkles size={16} className="text-secondary" />
              <span className="text-sm font-semibold text-secondary">Discover Premium Quality</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
              <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Transform Your Space
              </span>
            </h1>

            <p className="text-xl text-foreground/70 mb-10 leading-relaxed max-w-2xl mx-auto">
              Discover carefully curated furniture and home decor that brings comfort, style, and elegance to every
              corner of your home.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#products">
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-6 text-lg rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/30">
                  Shop Now
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <Link href="#products">
                <Button
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-lg font-semibold border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 bg-transparent"
                >
                  Explore Collections
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-4 bg-foreground/2 border-y border-border/40">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Truck className="text-secondary" size={24} />
              </div>
              <div>
                <p className="font-semibold text-foreground">Free Shipping</p>
                <p className="text-sm text-foreground/60">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="text-primary" size={24} />
              </div>
              <div>
                <p className="font-semibold text-foreground">Secure Payment</p>
                <p className="text-sm text-foreground/60">100% safe transactions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Sparkles className="text-secondary" size={24} />
              </div>
              <div>
                <p className="font-semibold text-foreground">Premium Quality</p>
                <p className="text-sm text-foreground/60">Carefully selected items</p>
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
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 -z-10" />

        <div className="container mx-auto max-w-2xl text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Ready to Transform Your Home?</h3>
          <p className="text-lg text-foreground/70 mb-8">
            Explore our full collection and find the perfect pieces for your space.
          </p>
          <Link href="#products">
            <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-6 text-lg rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-secondary/30">
              Start Shopping
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
