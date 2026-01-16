"use client"

import Link from "next/link"
import { ShoppingCart, User, Menu, X, ChevronDown, Package } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { items } = useCart()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("access_token"))
    setIsHydrated(true)
  }, [])

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    setIsLoggedIn(false)
    setIsProfileDropdownOpen(false)
    router.push("/")
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md border-b border-border/40 shadow-lg" : "bg-background"
        }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              Family & Home
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-foreground/80 hover:text-primary transition-colors font-medium text-sm">
              Shop
            </Link>
            <Link href="/about" className="text-foreground/80 hover:text-primary transition-colors font-medium text-sm">
              About
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isHydrated && (
              <>
                <Link href="/cart" className="relative group p-2 rounded-lg hover:bg-muted transition-colors">
                  <ShoppingCart size={24} className="text-foreground/70 group-hover:text-primary transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-fade-in-scale shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {isLoggedIn ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-1"
                    >
                      <User size={24} className="text-foreground/70 hover:text-primary transition-colors" />
                      <ChevronDown
                        size={16}
                        className={`text-foreground/70 transition-transform duration-300 ${isProfileDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50 animate-fade-in-scale">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-foreground/80 hover:text-primary hover:bg-muted transition-colors text-sm font-medium"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          View Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 text-foreground/80 hover:text-primary hover:bg-muted transition-colors text-sm font-medium"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          My Orders
                        </Link>
                        <hr className="my-2 border-border/50" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 font-medium text-sm"
                  >
                    Login
                  </Link>
                )}
              </>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {isMenuOpen ? (
                <X size={24} className="text-foreground/70" />
              ) : (
                <Menu size={24} className="text-foreground/70" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border/50 space-y-3 animate-slide-down">
            <Link
              href="/shop"
              className="block px-4 py-2 text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              About
            </Link>
            {isLoggedIn && (
              <Link
                href="/orders"
                className="flex items-center gap-2 px-4 py-2 text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                <Package size={18} />
                My Orders
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
