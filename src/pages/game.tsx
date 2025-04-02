import { useParams } from "react-router-dom";
import NotFound from "./not-found";
import { GameChannelType } from "@/enums";

import Olho from "@/pages/Games/olho/Olho"
import NewOlho from "@/pages/Games/olho/newOlho"
import { useSocketContext } from "@/components/providers/socket-provider";
import { BannerProvider } from "@/components/custom/banner-system/context";

const Game = () => {
	const { roomType, roomId } = useParams();
	const { socket } = useSocketContext()

	if (!socket || socket == undefined || socket == null)
		return <NotFound />
	
	const gameEnum: GameChannelType = Number(roomType)

	switch (gameEnum) {
		case GameChannelType.OLHO:
			return <BannerProvider>
				<NewOlho roomId={roomId as string} />
			</BannerProvider>
		default:
			return <NotFound />;
	}
}

export default Game