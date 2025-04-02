import React from 'react';
import { LangTranslationKey, RoomStateBase } from '@/enums';
import { Separator } from '@radix-ui/react-select';
import { cx } from 'class-variance-authority';
import { LucideTrash2, SendHorizontal } from 'lucide-react';

import NewChannelDialog, {NewChannelFormData} from '@/components/custom/dialogs/new-channel-dialog';
import Heading from '@/components/custom/heading';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableCell } from '../ui/table';
import { apiCreateGameRoom, apiDeleteGameRoom, apiJoinGameRoom } from '@/api/general';
import { Socket } from 'socket.io-client';

type OldGameRoomListProps = {
	socket: Socket | null
	lang: (key: LangTranslationKey) => string,
	dialogOpen: boolean, setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
	rooms: Room[], user: User | null
}

const OldGameRoomList: React.FC<React.PropsWithChildren<OldGameRoomListProps>> = ({socket, user, rooms, lang, dialogOpen, setDialogOpen}) => {

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
		<div className="appWrapper size-full max-w-screen-lg flex items-center justify-center bg-no-repeat bg-center mb-10 /*bg-[url(/lobby-wp2.png)]*/">
			<div className="app size-full flex flex-col">
				<div className="app-content mx-auto mt-10 flex flex-grow flex-col w-[550px] h-[700px] rounded-xl border bg-card text-card-foreground shadow">
					<div className="content-header px-5 h-14 flex items-center">
						<Heading level={3}>{lang(LangTranslationKey.NEW_CHANNEL)}</Heading>
						<NewChannelDialog open={dialogOpen} setOpen={setDialogOpen} onSubmit={handleNewChannelDialogSubmit} />
					</div>
					<Separator className="border" />

					<div className="table-wrapper w-full flex-grow overflow-y-auto">
						
						<Table className="w-full table-auto">
							<TableHeader className="sticky">
								<TableRow>
									<TableHead className="text-left pl-4">{lang(LangTranslationKey.ROOM_NAME)}</TableHead>
									<TableHead className="text-center">{lang(LangTranslationKey.GAME)}</TableHead>
									<TableHead className="text-center">{lang(LangTranslationKey.STATE)}</TableHead>
									<TableHead className="text-center">{lang(LangTranslationKey.PLAYER_COUNT)}</TableHead>
									<TableHead className="w-4 text-right"></TableHead>
								</TableRow>
							</TableHeader>
							<tbody className="table-body w-full">
								{rooms.map((room) => (
									<TableRow key={room.name}>
										<TableCell className="text-left pl-4">{room.name}</TableCell>
										<TableCell className="text-center">{lang(room.type)}</TableCell>
										<TableCell className={cx("text-center text-warning", {"text-destructive": room.state === RoomStateBase.ONGOING})}>{lang(room.state)}</TableCell>
										<TableCell className="text-center">{room.players.length}/7</TableCell>
										<TableCell className="w-4 text-right">
											<div className="flex">
												<Button onClick={handleRoomJoin(room.id)} size="sm" variant={"outline"} className="border-transparent px-2 py-1 bg-transparent">
													<SendHorizontal className="text-confirm" size="16px"/>
												</Button>
												{/* Only show if is room operator */}
												{room.operator === user?.id ? <Button onClick={handleRoomDelete(room.id)} size="sm" variant={"outline"} className="border-transparent px-2 py-1 bg-transparent">
													<LucideTrash2 className="text-destructive" size="16px"/>
												</Button> : <></>}
											</div>
										</TableCell>
									</TableRow>
								))}
							</tbody>
						</Table>
					</div>

					<Separator className="border" />
					<div className="mt-4 text-sm text-muted-foreground text-center w-full my-3">
						{lang(LangTranslationKey.LOBBY_TABLE_CAPTION)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default OldGameRoomList;
