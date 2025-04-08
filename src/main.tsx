import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { AppSettingsProvider } from '@/components/providers/settings-provider'
import Langs from "@/lang"
import { BrowserRouter as Router } from 'react-router-dom'
import { SocketProvider } from '@/components/providers/socket-provider'


if (import.meta.env.DEV) {
	import("react-scan").then(({useScan}) => {
		useScan({ enabled: false })
	});
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AppSettingsProvider availableLanguages={Langs}>
			<Router>
				<div className="flex size-full flex-col items-center">
					<SocketProvider>
						<App />
					</SocketProvider>
				</div>
			</Router>
		</AppSettingsProvider>
	</StrictMode>,
)
