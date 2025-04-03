import Heading from "@/components/custom/heading"
import { useAppSettings } from "@/components/providers/settings-provider"
import { LangKey } from "@/enums"

const NotFound = () => {
	const { lang } = useAppSettings()

	return (
		<div className="Not-Found size-full max-w-screen-lg flex flex-col items-center py-28 justify-between">
			<Heading>
				<span className="text-destructive">404</span> {lang(LangKey.PAGE_NOT_FOUND)}
			</Heading>
		</div>
	)
}

export default NotFound