import { useEffect, useState } from 'react'
import { useAppSettings } from '@/components/providers/settings-provider'
import { useSocketContext } from '@/components/providers/socket-provider'

import Nav from '@/components/custom/nav'
import OldGameRoomList from '@/components/Lobby/OldGameRoomList'
import NewGameRoomList from '@/components/Lobby/NewGameRoomList'
import Nav2 from '@/components/custom/nav2'

function GameLobby() {
	const { socket, rooms, user } = useSocketContext()
	const { lang } = useAppSettings();
	const [dialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		socket?.emit("getRooms")
	}, [socket]);


	return (
		<div className="game-lobby size-full flex flex-col items-center p-8 bg-no-repeat bg-cover bg-[url(/lobby-wp2.png)]">
			<Nav />
			{/*<Nav2 />*/}
			<OldGameRoomList socket={socket} lang={lang} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} rooms={rooms} user={user} />
			{/*<NewGameRoomList socket={socket} lang={lang} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} rooms={rooms} user={user} />*/}
		</div>
  	)
}

export default GameLobby
