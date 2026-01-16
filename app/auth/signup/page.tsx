"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ full_name: "", phone: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
      const response = await fetch(`${apiUrl}/api/v1/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Signup failed")
      }

      router.push("/login")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card rounded-lg border border-border p-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
        <p className="text-muted-foreground mb-8">Join us and start shopping</p>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
            <AlertCircle className="text-destructive flex-shrink-0" size={20} />
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
            <Input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
            <Input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="coral-accent w-full">
            {loading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
