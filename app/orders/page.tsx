"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Package, Calendar, MapPin, DollarSign, Clock } from "lucide-react"

interface Order {
    id: number
    customer_name: string
    customer_phone: string
    customer_address: string
    items_summary: string
    total_price: number
    receipt_url: string
    status: string
    created_at: string
}

export default function OrdersPage() {
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("access_token")
                if (!token) {
                    router.push("/login")
                    return
                }

                const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
                const response = await fetch(`${apiUrl}/api/v1/store/orders`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (response.status === 401) {
                    localStorage.removeItem("access_token")
                    router.push("/login")
                    return
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch orders")
                }

                const data = await response.json()
                setOrders(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load orders")
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [router])

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
            case "processing":
                return "bg-yellow-100 text-yellow-800"
            case "shipped":
                return "bg-blue-100 text-blue-800"
            case "delivered":
                return "bg-green-100 text-green-800"
            case "cancelled":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto"></div>
                    <p className="text-muted-foreground">Loading your orders...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Profile</span>
                    </Link>
                    <h1 className="text-3xl font-bold">My Orders</h1>
                </div>

                {error ? (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center max-w-md mx-auto">
                        <p className="text-destructive mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16 bg-card rounded-2xl border border-border">
                        <Package size={64} className="mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                        <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
                        <Link
                            href="/shop"
                            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all font-medium"
                        >
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-lg">Order #{order.id}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar size={14} />
                                            <span>{new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xl font-bold text-primary">
                                        <DollarSign size={20} />
                                        <span>{order.total_price.toFixed(2)} EGP</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <h4 className="font-medium flex items-center gap-2 text-foreground/80">
                                            <Package size={16} />
                                            Items
                                        </h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed pl-6">
                                            {order.items_summary}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-medium flex items-center gap-2 text-foreground/80">
                                            <MapPin size={16} />
                                            Delivery Details
                                        </h4>
                                        <div className="pl-6 text-sm space-y-1">
                                            <p className="text-foreground">{order.customer_name}</p>
                                            <p className="text-muted-foreground">{order.customer_phone}</p>
                                            <p className="text-muted-foreground">{order.customer_address}</p>
                                        </div>
                                    </div>
                                </div>

                                {order.receipt_url && (
                                    <div className="mt-6 pt-4 border-t border-border flex justify-end">
                                        <a
                                            href={order.receipt_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline hover:text-primary/80 transition-colors"
                                        >
                                            View Receipt Image
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
