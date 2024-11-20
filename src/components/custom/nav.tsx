import React from "react"
import { Heading } from "./heading"
import { useAppSettings } from "../providers/settings-provider"
import LangSwitch from "./switchs/lang-switch"
import ThemeSwitch from "./switchs/theme-switch"
import { LangTranslationKey } from "@/enums"
import { useSocketContext } from "../providers/socket-provider"


const Nav = () => {
	const { lang } = useAppSettings()
	const { user } = useSocketContext()
	
	return (<nav className="nav-bar h-20 px-10 flex-grow min-w-[70%] max-w-[90%] flex items-center rounded-sm bg-card text-card-foreground shadow">
		<div className="header">
			<Heading level={2} className="text-confirm">{lang(LangTranslationKey.WEBSITE_NAME)}</Heading>
			<div className="text-left text-muted-foreground">
				{user === null ? lang(LangTranslationKey.LOGGED_OUT) : lang(LangTranslationKey.LOGGED_IN) + user.username}
			</div>
		</div>
		<div className="switches flex justify-between items-center w-[360px] ml-auto">
			<LangSwitch className="lang-switch" />
			<ThemeSwitch className="ml-1 theme-switch" />
		</div>
	</nav>)
}

export default Nav