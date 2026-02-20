export interface Product {
    id: number
    name: string
    price: number
    category: string
    description?: string
    image_url?: string
    gallery?: string[]
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export const api = {
    getProducts: async (): Promise<Product[]> => {
        try {
            // Use Next.js fetch caching (ISR). Revalidates every 1 hour (3600 seconds)
            const response = await fetch(`${API_BASE_URL}/api/v1/store/products`, {
                next: { revalidate: 3600 }
            })
            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.statusText}`)
            }
            const data = await response.json()
            // Filter out any products that might be missing an ID to prevent errors
            const validProducts = Array.isArray(data)
                ? data.filter((p: any) => p && p.id !== undefined && p.id !== null)
                : []
            return validProducts
        } catch (error) {
            console.error("API Error:", error)
            return [] // Return empty array on error to prevent page crashes
        }
    },

    getProduct: async (id: string | number): Promise<Product | null> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/store/products/${id}`)
            if (!response.ok) {
                throw new Error(`Failed to fetch product: ${response.statusText}`)
            }
            const data = await response.json()
            return data
        } catch (error) {
            console.error("API Error:", error)
            return null
        }
    },
}
