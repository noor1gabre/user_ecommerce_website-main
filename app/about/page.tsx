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
    { number: "20+", label: "Years Experience" },
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
            Since 2004, we've been dedicated to bringing beauty, comfort, and quality into homes worldwide.
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
              Founded in 2004, our journey began with a simple vision: to create spaces that inspire and comfort. What
              started as a small boutique furniture shop has grown into a trusted name in home design and furnishings.
            </p>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We believe that your home should reflect your personality and values. That's why we carefully curate every
              piece in our collection, working directly with skilled artisans and sustainable suppliers around the
              world.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, we serve over 15,000 satisfied customers and continue to expand our collection with the latest in
              design trends while maintaining our commitment to quality and sustainability.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-card py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">These principles guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="animate-fade-in-up bg-background rounded-xl p-8 text-center hover:shadow-xl transition-smooth hover:border-secondary border border-border group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 mb-6 group-hover:from-secondary/30 group-hover:to-secondary/20 transition-colors">
                    <Icon className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <p className="text-4xl md:text-5xl font-bold text-secondary mb-2">{stat.number}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-card py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Passionate professionals dedicated to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { name: "Sarah Johnson", role: "Founder & CEO" },
              { name: "Michael Chen", role: "Design Director" },
              { name: "Emma Williams", role: "Operations Manager" },
              { name: "David Martinez", role: "Customer Success Lead" },
            ].map((member, index) => (
              <div
                key={index}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 rounded-xl overflow-hidden h-64 bg-muted">
                  <img
                    src={`/placeholder.svg?height=256&width=256&query=professional headshot`}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-sm text-secondary">{member.role}</p>
              </div>
            ))}
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
