"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle, LogOut, ShoppingBag, Settings, ArrowLeft } from "lucide-react"

interface UserData {
  id?: string
  phone: string
  full_name: string
  email?: string
}

interface Order {
  id: number
  total_price: number
}

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<UserData | null>(null)
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 })

  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      try {
        const token = localStorage.getItem("access_token")
        if (!token) {
          router.push("/login")
          return
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

        // 1. Fetch Profile
        const profileResponse = await fetch(`${apiUrl}/api/v1/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (profileResponse.status === 401) {
          localStorage.removeItem("access_token")
          router.push("/login")
          return
        }

        if (!profileResponse.ok) throw new Error("Failed to fetch profile")
        const profileData = await profileResponse.json()
        setUserData(profileData)
        setEditData(profileData)

        // 2. Fetch Orders for Stats
        const ordersResponse = await fetch(`${apiUrl}/api/v1/store/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (ordersResponse.ok) {
          const ordersData: Order[] = await ordersResponse.json()
          const totalSpent = ordersData.reduce((sum, order) => sum + order.total_price, 0)
          setStats({
            totalOrders: ordersData.length,
            totalSpent: totalSpent
          })
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfileAndOrders()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    router.push("/")
  }

  const handleEditChange = (field: keyof UserData, value: string) => {
    setEditData((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleSaveProfile = async () => {
    if (!editData) return

    try {
      const token = localStorage.getItem("access_token")
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

      const response = await fetch(`${apiUrl}/api/v1/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      setUserData(editData)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <AlertCircle size={48} className="text-destructive mx-auto" />
          <h1 className="text-2xl font-bold">Profile Not Found</h1>
          <p className="text-muted-foreground">{error || "Unable to load your profile"}</p>
          <Button onClick={() => router.push("/")} className="w-full">
            Return Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Shop</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-8 sticky top-24 space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {userData.full_name?.charAt(0).toUpperCase() || "U"}
                </div>
                <h1 className="text-2xl font-bold mt-4 text-center">{userData.full_name}</h1>
                <p className="text-sm text-muted-foreground mt-1">{userData.phone}</p>
              </div>

              {/* Quick Links */}
              <div className="space-y-2 pt-4 border-t border-border">
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors group"
                >
                  <ShoppingBag size={20} className="text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-sm">My Orders</p>
                    <p className="text-xs text-muted-foreground">View order history</p>
                  </div>
                </Link>

              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-medium group"
              >
                <LogOut size={20} className="group-hover:rotate-180 transition-transform duration-300" />
                Logout
              </button>
            </div>
          </div>

          {/* Edit Profile Section */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl border border-border p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {isEditing ? "Edit Profile" : "Profile Information"}
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 font-medium text-sm"
                  >
                    Edit
                  </button>
                )}
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-3">
                  <AlertCircle className="text-destructive flex-shrink-0" size={20} />
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              {isEditing ? (
                <div className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Full Name</label>
                    <input
                      type="text"
                      value={editData?.full_name || ""}
                      onChange={(e) => handleEditChange("full_name", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">Phone Number</label>
                    <input
                      type="tel"
                      value={editData?.phone || ""}
                      onChange={(e) => handleEditChange("phone", e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>



                  <div className="flex gap-4 pt-6">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 font-medium"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false)
                        setEditData(userData)
                      }}
                      className="flex-1 px-6 py-3 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Display Info */}
                  <div className="space-y-6">
                    <div className="group">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Full Name</p>
                      <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {userData.full_name}
                      </p>
                    </div>

                    <div className="group">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Phone Number</p>
                      <p className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {userData.phone}
                      </p>
                    </div>

                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                    <div className="text-center">
                      <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {stats.totalOrders}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Total Orders</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        R {stats.totalSpent.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Total Spent</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
