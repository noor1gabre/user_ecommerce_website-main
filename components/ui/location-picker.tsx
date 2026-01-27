"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch"
import "leaflet-geosearch/dist/geosearch.css"

// Fix for default marker icon in Leaflet with Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})

export interface AddressData {
    street_address: string
    local_area: string
    city: string
    province: string // Mapped to 'zone' for Courier Guy
    postal_code: string // Mapped to 'code' for Courier Guy
    country: string
    lat: number
    lng: number
}

interface LocationPickerProps {
    onAddressFound: (address: AddressData) => void
}

function SearchField({ onLocationSelected }: { onLocationSelected: (lat: number, lng: number) => void }) {
    const map = useMap()

    useEffect(() => {
        const provider = new OpenStreetMapProvider({
            params: {
                countrycodes: 'za', // Limit to South Africa
            },
        })

        // @ts-ignore
        const searchControl = new GeoSearchControl({
            provider: provider,
            style: 'bar',
            showMarker: false, // We use our own marker
            showPopup: false,
            autoClose: true,
            retainZoomLevel: false,
            animateZoom: true,
            keepResult: false,
            searchLabel: 'Enter address',
        })

        map.addControl(searchControl)

        map.on('geosearch/showlocation', (result: any) => {
            if (result.location) {
                onLocationSelected(result.location.y, result.location.x)
            }
        })

        return () => {
            map.removeControl(searchControl)
        }
    }, [map, onLocationSelected])

    return null
}

function LocationMarker({ onAddressFound }: LocationPickerProps) {
    const [position, setPosition] = useState<L.LatLng | null>(null)

    // Define fetchAddress outside to be used by both click and search
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

                // Map Nominatim fields to our schema and Courier Guy requirements
                const result: AddressData = {
                    street_address: addr.road ? `${addr.house_number || ''} ${addr.road}`.trim() : "",
                    local_area: addr.suburb || addr.neighbourhood || "",
                    // Improved City Extraction: Check all possible fields
                    city: addr.city || addr.town || addr.village || addr.municipality || addr.city_district || addr.county || "",
                    province: addr.state || addr.province || "Gauteng",
                    postal_code: addr.postcode || "",
                    country: addr.country || "South Africa",
                    lat: lat,
                    lng: lng
                }

                // Simple check to ensure we are roughly in SA
                if (data.address.country_code !== "za") {
                    console.warn("Location selected outside of South Africa")
                }

                onAddressFound(result)
            }

        } catch (error) {
            console.error("Geocoding error:", error)
        }
    }

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
            fetchAddress(e.latlng.lat, e.latlng.lng)
        })
    }, [map])

    // Logic for SearchField callback
    const handleSearchLocation = (lat: number, lng: number) => {
        const newPos = new L.LatLng(lat, lng)
        setPosition(newPos)
        // map.flyTo(newPos, 16) // geosearch does this already usually
        fetchAddress(lat, lng)
    }

    return (
        <>
            <SearchField onLocationSelected={handleSearchLocation} />
            {position === null ? null : (
                <Marker position={position} icon={icon}></Marker>
            )}
        </>
    )
}

export default function LocationPicker({ onAddressFound }: LocationPickerProps) {
    // South Africa Center (approx)
    const center = { lat: -30.5595, lng: 22.9375 }

    return (
        <div className="h-[300px] w-full rounded-lg overflow-hidden border border-border z-0 relative">
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
