export enum ApiEventType {
	NewRoom,
	DeleteRoom,
	JoinRoom,
	LeaveRoom,
	CreateUserId,
	GetUserId,
	PresidentRoomGetInfo,
	SetUserReady,
	PresidentRoomStartGame,
	PresidentRoomPlayHand
}

export enum LangTranslationKey {
	IDLE,
	ONGOING,
	//JOGOS have to be first
	OLHO,
	NUM,

	WEBSITE_NAME,
	NEW_CHANNEL,
	LANGUAGE,
	THEME,
	PAGE_NOT_FOUND,
	LOGGED_IN,
	LOGGED_OUT,
	ROOM_NAME,
	GAME,
	PLAYER_COUNT,
	LOBBY_TABLE_CAPTION,
	CREATE_GAME_ROOM,
	CREATE_ROOM_DIALOG_DESCRIPTION,
	CLOSE,
	CHOOSE_YOUR_USERNAME,
	USERNAME_DIALOG_DESCRIPTION,
	USER_NAME,
	CREATE_USER,
	STATE,
	PASSED,
	WAITING,
	PLAYING,
	FINNISHED,
	LEFTROOM,
	PRESIDENT,
	VICEPRESIDENT,
	NEUTRAL,
	VICEOLHO,
	INCOMING,
	OUTGOING
}

export enum GameChannelType {
	OLHO = LangTranslationKey.OLHO,
	NUM
}

export enum RoomStateBase {
	IDLE = LangTranslationKey.IDLE,
	ONGOING = LangTranslationKey.ONGOING
}

export enum Suit {
	DIAMONDS,
	CLUBS,
	HEARTS,
	SPADES
}

export enum PresidentPosition {
	PRESIDENT,
	VICE_PRESIDENT,
	Neutral,
	VICE_OLHO,
	OLHO
}

export enum PresidentPlayerState {
	PASSED, WAITING, PLAYING, FINISHED, LEFTROOM
}

export enum PresidentPlayHandType {
	SKIP, HAND, JOKER
}

export enum PresidentLogType {
	SKIP, HAND, BUFF
}

export enum OlhoDonationType {
	OUTGOING, INCOMING
}

export enum SoundName {
	READY_TO_PLAY,
	OLHO_ABAFADO,
	JOKER,
}
