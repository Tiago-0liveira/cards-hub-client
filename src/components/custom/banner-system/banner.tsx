import type React from "react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { BannerItem } from "./context"

interface BannerProps {
	banner: BannerItem
	onComplete: () => void
	isActive: boolean
}

const Banner: React.FC<BannerProps> = ({ banner, onComplete, isActive }) => {
	const [animationState, setAnimationState] = useState<"entering" | "visible" | "exiting" | "hidden">("hidden")

	// Default duration is 3 seconds if not specified
	const duration = banner.duration || 3000

	useEffect(() => {
		let enterTimeout: NodeJS.Timeout
		let visibleTimeout: NodeJS.Timeout
		let exitTimeout: NodeJS.Timeout

		if (isActive) {
			// Start the enter animation
			setAnimationState("entering")

			// After enter animation completes, set to visible
			enterTimeout = setTimeout(() => {
				setAnimationState("visible")

				// After duration, start exit animation
				visibleTimeout = setTimeout(() => {
					setAnimationState("exiting")

					// After exit animation completes, signal completion
					exitTimeout = setTimeout(() => {
						onComplete()
					}, 500) // Exit animation duration
				}, duration)
			}, 500) // Enter animation duration
		}

		return () => {
			clearTimeout(enterTimeout)
			clearTimeout(visibleTimeout)
			clearTimeout(exitTimeout)
		}
	}, [isActive, duration, onComplete])

	if (!isActive && animationState === "hidden") {
		return null
	}

	const animationClasses = {
		entering: "animate-banner-enter",
		visible: "opacity-100 scale-100",
		exiting: "animate-banner-exit",
		hidden: "opacity-0 scale-95",
	}

	return (
		<div
			className={cn(
				"fixed top-[23%] left-1/2 transform -translate-x-1/2 z-0",
				"px-6 py-3 rounded-lg text-white font-medium",
				"transition-all duration-500 w-full flex flex-col items-center justify-center",
				animationClasses[animationState],
			)}
		>
			{banner.content}
		</div>
	)
}

export default Banner