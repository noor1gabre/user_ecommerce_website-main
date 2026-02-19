"use client"

import Link from "next/link"
import { Heart, Award, Users, Leaf } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Quality First",
      description:
        "We source only the finest materials and work with skilled craftspeople to ensure every piece meets our exacting standards.",
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized by industry leaders for our innovative designs and outstanding customer service.",
    },
    {
      icon: Users,
      title: "Customer Focused",
      description:
        "Your satisfaction is our priority. We offer personalized consultations and lifetime support for every purchase.",
    },
    {
      icon: Leaf,
      title: "Sustainable",
      description:
        "Committed to environmental responsibility with eco-friendly materials and ethical manufacturing practices.",
    },
  ]

  const stats = [
    { number: "15K+", label: "Happy Customers" },
    { number: "2K+", label: "Products" },
    { number: "50+", label: "Awards" },
    { number: "10+", label: "Years Experience" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="animate-fade-in-up bg-gradient-to-br from-primary via-primary to-primary/80 text-white py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Crafting Spaces, Creating Memories
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            We've been dedicated to bringing beauty, comfort, and quality into homes, transforming living spaces one piece at a time.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <img src="/modern-furniture-showroom.png" alt="Our Story" className="rounded-2xl shadow-2xl" />
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <h2 className="text-4xl font-bold text-foreground mb-6">Our Story</h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Our journey began with a simple vision: to create spaces that inspire and comfort. What started as a passion for quality furniture has grown into a trusted destination for home design and furnishings.
            </p>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We believe that your home should reflect your unique personality and values. That's why we meticulously select every piece in our collection, partnering with skilled artisans and reputable suppliers who share our commitment to craftsmanship.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, we are proud to serve thousands of happy customers, continuously expanding our range with timeless designs while maintaining our dedication to quality and service.
            </p>
          </div>
        </div>
      </div>



      {/* CTA Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Transform Your Space?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore our collections and discover the perfect pieces for your home.
        </p>
        <Link
          href="/shop"
          className="inline-block px-8 py-4 bg-gradient-to-r from-secondary to-secondary/80 text-white font-bold rounded-xl hover:shadow-lg transition-smooth hover:scale-105"
        >
          Shop Our Collections
        </Link>
      </div>
    </div>
  )
}
