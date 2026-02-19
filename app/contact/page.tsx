"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="animate-fade-in-up bg-gradient-to-br from-primary via-primary to-primary/80 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-lg text-white/80">We'd love to hear from you. Let's create something amazing together.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Contact Info */}
          {[
            {
              icon: Phone,
              title: "Phone",
              content: "+27 67 100 4162",
              description: "Available Monday-Friday, 9 AM-6 PM",
            },
            {
              icon: MapPin,
              title: "Address",
              content: "China Mall, Main Reef Road, Amalgam, Johannesburg",
              description: "Visit our showroom",
            },
          ].map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="animate-fade-in-up bg-card rounded-xl p-8 border border-border hover:border-secondary transition-smooth"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/20 mb-6">
                  <Icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-lg font-semibold text-secondary mb-2">{item.content}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            )
          })}
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto">
          <div className="animate-fade-in-up bg-card rounded-2xl p-8 md:p-12 border border-border shadow-lg">
            <h2 className="text-3xl font-bold text-foreground mb-8">Send us a Message</h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                <p className="font-medium">Thank you! We've received your message and will respond soon.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-secondary focus:outline-none transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-secondary focus:outline-none transition-colors"
                />
              </div>

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-secondary focus:outline-none transition-colors"
              />

              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-secondary focus:outline-none transition-colors resize-none"
              />

              <button
                type="submit"
                className="w-full py-3 px-6 bg-gradient-to-r from-secondary to-secondary/80 text-white font-bold rounded-lg hover:shadow-lg transition-smooth hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Quick answers to common questions</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "Do you offer shipping?",
                a: "Yes, we deliver across South Africa. Shipping costs and times vary by location.",
              },
              {
                q: "Can I customize furniture?",
                a: "Contact our design team for custom furniture options.",
              },
              {
                q: "How long does delivery take?",
                a: "Standard delivery takes 2-5 business days depending on your location.",
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="group bg-card rounded-lg border border-border p-6 cursor-pointer hover:border-secondary transition-colors"
              >
                <summary className="flex items-center justify-between font-bold text-foreground">
                  {faq.q}
                  <span className="text-secondary group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
