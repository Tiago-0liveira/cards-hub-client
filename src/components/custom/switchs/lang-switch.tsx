import React, { HTMLAttributes } from 'react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useAppSettings } from '@/components/providers/settings-provider'
import { LangKey } from '@/enums'

type LangSwitchProps = HTMLAttributes<HTMLDivElement>

const LangSwitch: React.FC<LangSwitchProps> = () => {
	const { language, setLanguage, availableLanguages, lang } = useAppSettings();

	const handleLanguageChange = (lang_name: string) => {
		const found_lang = availableLanguages.find(({ name }) => lang_name === name)
		if (found_lang !== undefined)
			setLanguage(found_lang);
		else {
			console.error(lang_name)
		}
	}

	return (
		<Select value={language.name} onValueChange={handleLanguageChange}>
			<SelectTrigger className="w-[160px]">
				<SelectValue placeholder={lang(LangKey.LANGUAGE)} />
			</SelectTrigger>
			<SelectContent>
				{availableLanguages.map(lang => (
					<SelectItem key={lang.name} value={lang.name}>
						<span className="flex items-center">
							<img className="lang-icon w-3 h-3 aspect-square" src={lang.iconSrc} alt={`icon-flag-${lang.name}`} />
							<span className="ml-1 lang-name">{lang.name}</span>
						</span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}

export default LangSwitch