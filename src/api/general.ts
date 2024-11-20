import { ApiEventType, GameChannelType, LangTranslationKey } from "@/enums";
import {Socket} from "socket.io-client"

export const channelTypeToString = (channelType: GameChannelType): string => {
	switch (channelType) {
		case GameChannelType.OLHO:
			return "Olho";
		default:
			throw Error(`Invalid GameChannelType value: ${channelType}`)
	}
}

export const apiEventTypeToString = (apiEventType: ApiEventType): string => {
	switch (apiEventType) {
		case ApiEventType.NewRoom:
			return "newRoom";
		case ApiEventType.DeleteRoom:
			return "deleteRoom"
		case ApiEventType.JoinRoom:
			return "joinRoom"
		case ApiEventType.LeaveRoom:
			return "leaveRoom"
		case ApiEventType.CreateUserId:
			return "createUserId"
		case ApiEventType.GetUserId:
			return "getUserId"
		case ApiEventType.SetUserReady:
			return "setUserReady"
		// PRESIDENT EventTypes
		case ApiEventType.PresidentRoomGetInfo:
			return "presidentRoomGetInfo"
		case ApiEventType.PresidentRoomStartGame:
			return "presidentRoomStartGame"
		case ApiEventType.PresidentRoomPlayHand:
			return "presidentRoomPlayHand"
		default:
			throw Error(`Invalid ApiEventType value: ${apiEventType}`)
	}
}

const apiEventNameBuilder = (channelType: GameChannelType, apiEventType: ApiEventType): string => {
	return [apiEventTypeToString(apiEventType), channelTypeToString(channelType)].join("-")
}

export const apiGameEventFunc = (channelType: GameChannelType) => (socket: Socket, apiEventType: ApiEventType, args: unknown) => {
	socket.emit(apiEventNameBuilder(channelType, apiEventType), args)
}

export const apiCreateGameRoom = (socket: Socket, roomName: string, gameType: LangTranslationKey, user_id: string) => {
	socket.emit(apiEventTypeToString(ApiEventType.NewRoom), { roomName, gameType, user_id })
}

export const apiDeleteGameRoom = (socket: Socket, roomId: string, userId: string) => {
	socket.emit(apiEventTypeToString(ApiEventType.DeleteRoom), { id: roomId, userId })
}

export const apiJoinGameRoom = (socket: Socket, roomId: string, userId: string) => {
	socket.emit(apiEventTypeToString(ApiEventType.JoinRoom), { id: roomId, userId })
}

export const apiLeaveGameRoom = (socket: Socket, roomId: string, userId: string) => {
	socket.emit(apiEventTypeToString(ApiEventType.LeaveRoom), { id: roomId, userId })
}

export const apiGameRoomSetUserReady = (socket: Socket, roomId: string, userId: string, ready: boolean) => {
	socket.emit(apiEventTypeToString(ApiEventType.SetUserReady), { roomId, userId, ready })
}

export const apiCreateUserId = (socket: Socket, username: string) => {
	socket.emit(apiEventTypeToString(ApiEventType.CreateUserId), { username })
}

export const apiGetUserId = (socket: Socket, id: string) => {
	socket.emit(apiEventTypeToString(ApiEventType.GetUserId), { id })
}
