"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
    isLoggedIn: boolean
    isLoading: boolean
    login: (token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check for token on mount
        const token = localStorage.getItem("access_token")
        setIsLoggedIn(!!token)
        setIsLoading(false)
    }, [])

    const login = (token: string) => {
        localStorage.setItem("access_token", token)
        setIsLoggedIn(true)
    }

    const logout = () => {
        localStorage.removeItem("access_token")
        setIsLoggedIn(false)
        router.push("/")
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
