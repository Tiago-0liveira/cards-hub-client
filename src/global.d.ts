import { LangTranslationKey, RoomStateBase, Suit } from "./enums"

declare global {
	export type Lang = {
		name: string,
		iconSrc: string,
		translations: {[key in LangTranslationKey]: string}
	}
	export type Room = {
		id: string;
		operator: string;
		players: User[];
		spectators: User[];
		name: string;
		type: number;
		state: RoomStateBase
	};
	export type User = {
		id: string;
		username: string;
		socketId: string;
		ready: boolean;
	}
	export type RoomCollection = { [K:string]: Room }

	export type GameComponentProps = {
		roomId: string
	}
	export type Card = {
		value: "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A" | "JOKER",
		suit: Suit | null
	}

	export type OlhoDonation = {
		type: OlhoDonationType,
		cards: Card[]
	}

	export type PresidentPlayer = {
		hand: Card[],
		position: PresidentPosition,
		state: PresidentPlayerState,
		handSize: number,
		donations: OlhoDonation[]
	}

	export type PresidentRoom = Room & {
		hands: Record<string, PresidentPlayer>,
		currentHand: Array<Array<Card>>,
		lastPlayer: string,
		lastPlayerAction: PresidentPlayHandType,
		currentPlayer: string,
		roundNumber: number,
		playerOrder: string[]
	}

	export type Hand = {
		type: PresidentLogType,
		cards: Card[]
	}

	export type PresidentRoomLog = {
		player_username: string,
		hand: Hand,
		handNumber: number
	}

	export type PresidentRoomWithLogs = PresidentRoom & {
		logs: Record<number, PresidentRoomLog[]>
	}
}
export {}