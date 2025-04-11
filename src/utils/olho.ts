import { LangKey, OlhoDonationType, PresidentPlayerState, PresidentPosition } from "../enums";

export const presidentPlayerStateToLangKey = (state: PresidentPlayerState): LangKey => {
	switch (state) {
		case PresidentPlayerState.PASSED:
			return LangKey.PASSED
		case PresidentPlayerState.WAITING:
			return LangKey.WAITING
		case PresidentPlayerState.PLAYING:
			return LangKey.PLAYING
		case PresidentPlayerState.FINISHED:
			return LangKey.FINNISHED
		case PresidentPlayerState.LEFTROOM:
			return LangKey.LEFTROOM
		default:
			throw Error("Invalid presidentPlayerState")
			break;
	}
}

export const presidentPlayerPositionToLangKey = (state: PresidentPosition): LangKey => {
	switch (state) {
		case PresidentPosition.PRESIDENT:
			return LangKey.PRESIDENT
		case PresidentPosition.VICE_PRESIDENT:
			return LangKey.VICEPRESIDENT
		case PresidentPosition.Neutral:
			return LangKey.NEUTRAL
		case PresidentPosition.VICE_OLHO:
			return LangKey.VICEOLHO
		case PresidentPosition.OLHO:
			return LangKey.OLHO
		default:
			throw Error("Invalid presidentPlayerPosition")
			break;
	}
}

export const presidentDonationTypeToLangKey = (type: OlhoDonationType): LangKey => {
	switch (type) {
		case OlhoDonationType.OUTGOING:
			return LangKey.OUTGOING
		case OlhoDonationType.INCOMING:
			return LangKey.INCOMING
		default:
			throw Error("Invalid presidentDonationType")
			break;
	}
}

export const PresidentPlayerStateToTailwindClasses = (state: PresidentPlayerState): string => {
	switch (state) {
		case PresidentPlayerState.PASSED:
			return "text-muted-foreground"
		case PresidentPlayerState.WAITING:
			return "text-warning"
		case PresidentPlayerState.PLAYING:
			return "text-confirm"
		case PresidentPlayerState.FINISHED:
			return "text-blue-500"
		case PresidentPlayerState.LEFTROOM:
			return "text-destructive"
		default:
			throw Error("Invalid presidentPlayerState")
			break;
	}
}

export const UserReadyStateToTailwindClasses = (ready: boolean): string => {
	switch (ready) {
		case true:
			return "text-confirm"
		case false:
			return "text-warning"
		default:
			throw Error("Invalid user ready state")
	}
}

export const PresidentPositionToTailwindClasses = (position: PresidentPosition): string => {
	switch (position) {
		case PresidentPosition.PRESIDENT:
			return "text-confirm"
		case PresidentPosition.VICE_PRESIDENT:
			return "text-confirmDarker"
		case PresidentPosition.Neutral:
			return "text-mutex-foreground"
		case PresidentPosition.VICE_OLHO:
			return "text-destructiveDarker"
		case PresidentPosition.OLHO:
			return "text-destructive"
		default:
			throw Error("Invalid presidentPosition")
	}
}
