"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-4">Family & Home</h3>
            <p className="text-white/70 mb-6">
              Creating beautiful spaces with premium furniture and design solutions for your home.
            </p>

          </div>

          {/* Quick Links */}
          <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/shop" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <h4 className="font-bold mb-6">Customer Service</h4>
            <ul className="space-y-3">
              {[
                { label: "Contact Us", href: "/contact" },
                { label: "FAQs", href: "/contact" },
                { label: "Shipping Info", href: "/contact" },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <h4 className="font-bold mb-6">Stay Updated</h4>
            <p className="text-white/70 mb-4">Subscribe to get special offers and updates.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-l-lg bg-white/20 text-white placeholder-white/50 outline-none"
              />
              <button className="px-4 py-2 rounded-r-lg bg-secondary hover:bg-secondary/90 transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm">© 2026 HomeDecor. All rights reserved.</p>
          <div className="flex items-center gap-8 mt-4 md:mt-0">
            {[
              { label: "Privacy Policy", href: "#" },
              { label: "Terms of Service", href: "#" },
              { label: "Cookie Policy", href: "#" },
            ].map((link, i) => (
              <Link key={i} href={link.href} className="text-white/70 hover:text-white transition-colors text-sm">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
