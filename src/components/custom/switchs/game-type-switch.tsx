import React, { HTMLAttributes, useState } from 'react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { useAppSettings } from '@/components/providers/settings-provider'
import { LangTranslationKey } from '@/enums'

type GameTypeSwitchProps = HTMLAttributes<HTMLDivElement> & {
    value: number;
    onChange: (value: number) => void;
};

const GameTypeSwitch: React.FC<GameTypeSwitchProps> = ({ value, onChange }) => {
	const { lang } = useAppSettings()

	return (
		<Select value={String(value)} onValueChange={(val) => onChange(Number(val))}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder={lang(value)} />
			</SelectTrigger>
			<SelectContent>
                {Array.from({ length: LangTranslationKey.NUM - LangTranslationKey.OLHO }, (_, i) => i + LangTranslationKey.OLHO).map(key => (
                    <SelectItem key={key} value={key.toString()}>
                        <span className="flex items-center">
                            <span className="ml-1 lang-name">{lang(key)}</span>
                        </span>
                    </SelectItem>
                ))}
            </SelectContent>
		</Select>
	)
}

export default GameTypeSwitch