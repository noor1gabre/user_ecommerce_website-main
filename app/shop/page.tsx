"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, Filter, Grid3x3, List } from "lucide-react"
import ProductCard from "@/components/product-card"
import { api, type Product } from "@/lib/api"



export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("featured")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts()
      setProducts(data)
      setFilteredProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = products

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase())
    }

    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === "newest") {
      filtered.reverse()
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, priceRange, sortBy])

  const categories = ["all", ...new Set(products.map((p) => p.category || "Uncategorized"))]
  const groupedProducts = filteredProducts.reduce<Record<string, Product[]>>((acc, product) => {
    const key = product.category || "Uncategorized"
    if (!acc[key]) acc[key] = []
    acc[key].push(product)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="animate-fade-in-up bg-gradient-to-br from-primary via-primary to-primary/80 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-white/70 hover:text-white transition-smooth">
              Home
            </Link>
            <span className="text-white/50">/</span>
            <span className="text-white font-medium">Shop</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Our Collections
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Discover our carefully curated selection of premium home and furniture pieces
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 animate-fade-in-up">
            <div className="sticky top-24 space-y-6">
              {/* Category Filter */}
              <div className="bg-card rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-secondary" />
                  Categories
                </h3>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-secondary cursor-pointer"
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors capitalize">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="bg-card rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-foreground mb-4">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-secondary"
                />
                <div className="flex justify-between items-center mt-4 text-sm">
                  <span className="text-muted-foreground">${priceRange[0].toLocaleString()}</span>
                  <span className="text-secondary font-bold">${priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border animate-fade-in-up">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-bold text-foreground">{filteredProducts.length}</span> products
              </p>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-secondary transition-smooth">
                    <span className="text-sm">Sort</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                    {[
                      { value: "featured", label: "Featured" },
                      { value: "newest", label: "Newest" },
                      { value: "price-low", label: "Price: Low to High" },
                      { value: "price-high", label: "Price: High to Low" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`w-full text-left px-4 py-3 text-sm border-b border-border/50 last:border-0 hover:bg-secondary/10 transition-colors ${sortBy === option.value ? "text-secondary font-bold" : "text-foreground"
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* View Mode */}
                <div className="flex items-center gap-2 border border-border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded transition-smooth ${viewMode === "grid" ? "bg-secondary text-white" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded transition-smooth ${viewMode === "list" ? "bg-secondary text-white" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-border border-t-secondary animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading products...</p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No products found matching your filters</p>
              </div>
            ) : (
              <div className="space-y-10">
                {Object.entries(groupedProducts).map(([category, products]) => (
                  <div key={category}>
                    <h2 className="text-xl font-bold text-foreground mb-4 capitalize">{category}</h2>
                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                          : "space-y-4"
                      }
                    >
                      {products.map((product, index) => (
                        <div
                          key={product.id}
                          style={{ animationDelay: `${index * 50}ms` }}
                          className="animate-fade-in-up"
                        >
                          {viewMode === "grid" ? (
                            <ProductCard product={product} />
                          ) : (
                            <Link href={`/product/${product.id}`}>
                              <div className="flex gap-4 bg-card rounded-xl overflow-hidden hover:shadow-xl transition-smooth border border-border hover:border-secondary cursor-pointer group">
                                <div className="w-32 h-32 relative overflow-hidden bg-muted flex-shrink-0">
                                  <img
                                    src={product.image_url || "/placeholder.svg"}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                  <div>
                                    <h3 className="font-bold text-foreground group-hover:text-secondary transition-colors">
                                      {product.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {product.description || "Premium quality furniture"}
                                    </p>
                                  </div>
                                  <div className="text-lg font-bold text-secondary">
                                    ${product.price.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
