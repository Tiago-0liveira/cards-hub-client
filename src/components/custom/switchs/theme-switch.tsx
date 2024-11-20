import React, { HTMLAttributes } from 'react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { isTheme, useAppSettings } from '@/components/providers/settings-provider';

type ThemeSwitchProps = HTMLAttributes<HTMLDivElement>

const ThemeSwitch: React.FC<ThemeSwitchProps> = () => {
	const { theme, setTheme } = useAppSettings();

	const handleThemeChange = (new_theme: string) => {
		if (isTheme(new_theme))
			setTheme(new_theme)
		else {
			console.error(new_theme)
		}
	}

	return (
		<Select value={theme} onValueChange={handleThemeChange}>
			<SelectTrigger className="w-[160px]">
				<SelectValue placeholder="Theme" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="light">Light</SelectItem>
				<SelectItem value="dark">Dark</SelectItem>
				<SelectItem value="system">System</SelectItem>
			</SelectContent>
		</Select>
	)
}

export default ThemeSwitch