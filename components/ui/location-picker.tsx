"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default marker icon in Leaflet with Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})

interface AddressData {
    street: string
    city: string
    province: string
    postal_code: string
    country: string
}

interface LocationPickerProps {
    onAddressFound: (address: AddressData) => void
}

function LocationMarker({ onAddressFound }: LocationPickerProps) {
    const [position, setPosition] = useState<L.LatLng | null>(null)
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
            fetchAddress(e.latlng.lat, e.latlng.lng)
        },
    })

    // Attempt to get user location on load
    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
            // Optional: Auto-fetch on load? Maybe annoying if accuracy is bad.
        })
    }, [map])

    const fetchAddress = async (lat: number, lng: number) => {
        try {
            // Using OpenStreetMap Nominatim API
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
                {
                    headers: {
                        "User-Agent": "EcommerceApp/1.0",
                        "Accept-Language": "en"
                    }
                }
            )
            const data = await response.json()

            if (data && data.address) {
                const addr = data.address
                // Map Nominatim fields to our schema
                const result = {
                    street: addr.road ? `${addr.house_number || ''} ${addr.road}`.trim() : "",
                    city: addr.city || addr.town || addr.village || addr.suburb || "",
                    province: addr.state || addr.province || "Gauteng", // Fallback logic might be needed
                    postal_code: addr.postcode || "",
                    country: addr.country || "South Africa"
                }

                // Simple check to ensure we are roughly in SA (Nominatim handles this usually, but good to check country code)
                if (data.address.country_code !== "za") {
                    // alert("Please select a location in South Africa.")
                    // Actually, we just pass what we found, strict validation can be in the form
                }

                onAddressFound(result)
            }

        } catch (error) {
            console.error("Geocoding error:", error)
        }
    }

    return position === null ? null : (
        <Marker position={position} icon={icon}></Marker>
    )
}

export default function LocationPicker({ onAddressFound }: LocationPickerProps) {
    // South Africa Center (approx)
    const center = { lat: -30.5595, lng: 22.9375 }

    // Dynamic import wrapper logic usually needed for MapContainer in some Next setups, 
    // but since file is "use client", we try direct first.

    return (
        <div className="h-[300px] w-full rounded-lg overflow-hidden border border-border z-0">
            <MapContainer
                center={center}
                zoom={5}
                style={{ height: "100%", width: "100%" }}
                maxBounds={[[-22.0, 16.0], [-35.0, 33.0]]} // Rough SA Bounds
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker onAddressFound={onAddressFound} />
            </MapContainer>
        </div>
    )
}
