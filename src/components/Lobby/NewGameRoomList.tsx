import React from 'react';
import { LangKey, RoomStateBase } from '@/enums';
import { Separator } from '@radix-ui/react-select';
import { cx } from 'class-variance-authority';
import { LucideTrash2, SendHorizontal } from 'lucide-react';

import NewChannelDialog, { NewChannelFormData } from '@/components/custom/dialogs/new-channel-dialog';
import Heading from '@/components/custom/heading';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '../ui/table';
import { apiCreateGameRoom, apiDeleteGameRoom, apiJoinGameRoom } from '@/api/general';
import { Socket } from 'socket.io-client';

type NewGameRoomListProps = {
	socket: Socket | null
	lang: (key: LangKey) => string,
	dialogOpen: boolean, setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
	rooms: Room[], user: User | null
}

const NewGameRoomList: React.FC<React.PropsWithChildren<NewGameRoomListProps>> = ({ socket, user, rooms, lang, dialogOpen, setDialogOpen }) => {

	const handleNewChannelDialogSubmit = (formData: NewChannelFormData) => {
		apiCreateGameRoom(socket as Socket, formData.roomName, formData.gameType, user?.id ?? "")
	}
	const handleRoomJoin = (roomId: string) => (_) => {
		apiJoinGameRoom(socket as Socket, roomId, user?.id ?? "")
	}
	const handleRoomDelete = (roomId: string) => (_) => {
		apiDeleteGameRoom(socket as Socket, roomId, user?.id ?? "")
	}

	return (
		<div className="appWrapper size-full max-w-screen-lg flex items-center justify-center bg-no-repeat bg-center /*bg-[url(/lobby-wp2.png)]*/">
			<div className="app w-[80%] h-[80%] grid grid-cols-autoFit auto-rows-min gap-5 justify-items-center">
				{rooms.length === 0
					?
					<div className="text-center w-48 h-10 text-lg flex items-center justify-center rounded-md bg-card">No rooms available</div>
					:
					rooms.map((room) => (
						<div className="relative room w-96 h-14 rounded-md bg-card" key={room.name}>
							<span className="text-left pl-2 absolute left-0">{room.name}</span>
							<span className="text-center pl-2 absolute left-0 bottom-0">{lang(room.type)}</span>
							<span className={cx("text-center text-warning", { "text-destructive": room.state === RoomStateBase.ONGOING })}>{lang(room.state)}</span>
							<span className="text-center">{room.players.length}/8</span>
							<span className="w-4 text-right absolute right-6 bottom-0">
								<span className="">
									<Button onClick={handleRoomJoin(room.id)} size="sm" variant={"outline"} className="border-transparent px-2 py-1 bg-transparent">
										<SendHorizontal className="text-confirm" size="16px" />
									</Button>
									{/* Only show if is room operator */}
									{room.operator === user?.id ? <Button onClick={handleRoomDelete(room.id)} size="sm" variant={"outline"} className="border-transparent px-2 py-1 bg-transparent">
										<LucideTrash2 className="text-destructive" size="16px" />
									</Button> : <></>}
								</span>
							</span>
						</div>
					))
				}
			</div>
		</div>
	);
}

export default NewGameRoomList;
