import { Route, Routes, Link } from 'react-router-dom';
import { Heading } from '@/components/custom/heading';
import LangSwitch from '@/components/custom/switchs/lang-switch';
import ThemeSwitch from '@/components/custom/switchs/theme-switch';
import { LangKey } from './enums';
import { useAppSettings } from '@/components/providers/settings-provider';
import { useSocketContext } from '@/components/providers/socket-provider';

import GameLobby from "@/pages/game-lobby"
import NotFound from '@/pages/not-found';
import Game from '@/pages/game';

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<GameLobby />} />
				<Route path="/room/:roomType/:roomId" element={<Game />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</>
	)
}

export default App
