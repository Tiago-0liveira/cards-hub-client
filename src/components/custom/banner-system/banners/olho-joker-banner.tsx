import { useAppSettings } from '@/components/providers/settings-provider'
import React, { useEffect } from 'react'


const OlhoJokerBanner = () => {
	const { volume } = useAppSettings()
	const videoRef = React.useRef<HTMLVideoElement>(null)

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.volume = volume / 100
		}
	}, [volume]);

	return <div className="flex items-center justify-center w-[80%] h-full">
		<video ref={videoRef} autoPlay width={700} height={900}>
			<source src="/videos/joker-laughing.webm" type="video/webm" />
			Your browser does not support the video tag.
		</video>
	</div>
}

export default OlhoJokerBanner