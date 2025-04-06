import React from "react"
import { useState, useEffect } from "react"
import { useBanner } from "./context"
import Banner from "./banner"

const BannerQueue: React.FC = () => {
	const { banners, removeBanner } = useBanner()
	const [activeBannerId, setActiveBannerId] = useState<string | null>(null)

	// Process the queue whenever the banners array changes or when a banner completes
	useEffect(() => {
		if (banners.length > 0 && activeBannerId === null) {
			// Activate the first banner in the queue
			setActiveBannerId(banners[0].id)
		}
	}, [banners, activeBannerId])

	const handleBannerComplete = (id: string) => {
		// Remove the completed banner
		removeBanner(id)
		// Reset active banner to process the next one
		setActiveBannerId(null)
	}

	const activeBanner = banners.find((banner) => banner.id === activeBannerId)
	if (!activeBanner) return null // No active banner to display

	return (
		<Banner
			key={activeBanner.id}
			banner={activeBanner}
			isActive={activeBanner.id === activeBannerId}
			onComplete={() => handleBannerComplete(activeBanner.id)}
		/>
	)
}

export default React.memo(BannerQueue)