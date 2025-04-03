import React from "react"
import Heading from "./heading"
import { useAppSettings } from "../providers/settings-provider"
import LangSwitch from "./switchs/lang-switch"
import ThemeSwitch from "./switchs/theme-switch"
import { LangKey } from "@/enums"
import { useSocketContext } from "../providers/socket-provider"
import { Slider } from "../ui/slider"
import { Volume1, Volume2, VolumeX } from "lucide-react"
import { Separator } from "@radix-ui/react-select"

const Nav2 = () => {
	const { lang, volume, setVolume } = useAppSettings()
	const { user } = useSocketContext()

	const handleVolumeSliderChange = (value: number[]) => {
		setVolume(value[0])
	}

	const getVolumeIconBySound = (value: number) => {
		if (value === 0)
			return <VolumeX />
		else if (value < 50)
			return <Volume1 />
		else
			return <Volume2 />
	}

	return (<nav className="nav-bar h-24 px-10 flex-grow w-full flex items-center bg-card text-card-foreground shadow">
		<div className="header">
			<Heading level={2} className="text-confirm">{lang(LangKey.WEBSITE_NAME)}</Heading>
			<div className="text-left text-muted-foreground">
				{user === null ? lang(LangKey.LOGGED_OUT) : lang(LangKey.LOGGED_IN) + user.username}
			</div>
		</div>
		<div className="settings flex flex-col justify-between items-center w-[400px] ml-auto">
			<div className="switches flex w-full justify-evenly">
				<LangSwitch className="lang-switch" />
				<ThemeSwitch className="ml-1 theme-switch" />
			</div>
			<div className="volume flex justify-center w-full">
				{getVolumeIconBySound(volume)}
				<Slider className="w-[75%] ml-3" onValueChange={handleVolumeSliderChange} defaultValue={[volume]} max={100} min={0} step={10} />
			</div>
		</div>
		<Separator />
	</nav>)
}

export default Nav2