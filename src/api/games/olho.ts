import { Socket } from "socket.io-client";
import { apiEventTypeToString } from "../general";
import { ApiEventType, PresidentPlayHandType } from "@/enums";

const OLHO_CARDS_VALUE_ARRAY = ["3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", "2", "JOKER"]
export const cards_value_compare = (a: Card, b: Card): number => (
	OLHO_CARDS_VALUE_ARRAY.indexOf(a.value) - OLHO_CARDS_VALUE_ARRAY.indexOf(b.value)
)

export const apiPresidentRoomGetInfo = (socket: Socket, id: string, userId: string) => {
	socket.emit(apiEventTypeToString(ApiEventType.PresidentRoomGetInfo), { id, userId })
}

export const apiPresidentRoomStartGame = (socket: Socket, id: string) => {
	socket.emit(apiEventTypeToString(ApiEventType.PresidentRoomStartGame), { id })
}

export const apiPresidentPlayHand = (socket: Socket, roomId: string, id: string, cards: Card[]) => {
	socket.emit(apiEventTypeToString(ApiEventType.PresidentRoomPlayHand), { roomId, userId: id, cards, type: PresidentPlayHandType.HAND })
}

export const apiPresidentSkipHand = (socket: Socket, roomId: string, id: string) => {
	socket.emit(apiEventTypeToString(ApiEventType.PresidentRoomPlayHand), { roomId, userId: id, type: PresidentPlayHandType.SKIP })
}