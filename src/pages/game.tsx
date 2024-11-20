import { useParams } from "react-router-dom";
import NotFound from "./not-found";
import { GameChannelType } from "@/enums";

import Olho from "@/pages/Games/Olho"
import { useSocketContext } from "@/components/providers/socket-provider";

const Game = () => {
	const { roomType, roomId } = useParams();
	const { socket } = useSocketContext()

	if (!socket || socket == undefined || socket == null)
		return <NotFound />
	
	const gameEnum: GameChannelType = Number(roomType)

	switch (gameEnum) {
		case GameChannelType.OLHO:
			return <Olho roomId={roomId as string} />
		default:
			return <NotFound />;
	}
}

export default Game