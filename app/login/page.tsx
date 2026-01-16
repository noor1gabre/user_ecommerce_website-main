"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [formData, setFormData] = useState({ phone: "", password: "" })
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
      const formDataObj = new FormData()
      formDataObj.append("username", formData.phone)
      formDataObj.append("password", formData.password)

      const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: "POST",
        body: formDataObj,
      })

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.")
      }

      const data = await response.json()
      login(data.access_token)
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card rounded-lg border border-border p-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
        <p className="text-muted-foreground mb-8">Sign in to your account</p>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
            <AlertCircle className="text-destructive flex-shrink-0" size={20} />
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-primary hover:text-primary/80 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
