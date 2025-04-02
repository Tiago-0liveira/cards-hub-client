import type React from "react"
import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// Define the banner item type
export type BannerItem = {
	id: string
	content: ReactNode
	duration?: number // How long the banner stays visible in ms
	type?: "success" | "error" | "info" | "warning" // Optional banner type for styling
}

// Define the context type
type BannerContextType = {
	addBanner: (banner: Omit<BannerItem, "id">) => void
	removeBanner: (id: string) => void
	banners: BannerItem[]
}

// Create the context with a default value
const BannerContext = createContext<BannerContextType | undefined>(undefined)

export const BannerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [banners, setBanners] = useState<BannerItem[]>([])

	// Add a banner to the queue
	const addBanner = useCallback((banner: Omit<BannerItem, "id">) => {
		const id = Math.random().toString(36).substring(2, 9)
		setBanners((prev) => [...prev, { ...banner, id }])
	}, [])

	// Remove a banner from the queue
	const removeBanner = useCallback((id: string) => {
		setBanners((prev) => prev.filter((banner) => banner.id !== id))
	}, [])

	return <BannerContext.Provider value={{ addBanner, removeBanner, banners }}>{children}</BannerContext.Provider>
}

// Custom hook to use the banner context
export const useBanner = () => {
	const context = useContext(BannerContext)
	if (context === undefined) {
		throw new Error("useBanner must be used within a BannerProvider")
	}
	return context
}

