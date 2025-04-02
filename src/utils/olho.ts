import { LangTranslationKey, OlhoDonationType, PresidentPlayerState, PresidentPosition } from "../enums";

export const presidentPlayerStateToLangKey = (state: PresidentPlayerState): LangTranslationKey => {
	switch (state) {
		case PresidentPlayerState.PASSED:
			return LangTranslationKey.PASSED
		case PresidentPlayerState.WAITING:
			return LangTranslationKey.WAITING
		case PresidentPlayerState.PLAYING:
			return LangTranslationKey.PLAYING
		case PresidentPlayerState.FINISHED:
			return LangTranslationKey.FINNISHED
		case PresidentPlayerState.LEFTROOM:
			return LangTranslationKey.LEFTROOM
		default:
			throw Error("Invalid presidentPlayerState")
			break;
	}
}

export const presidentPlayerPositionToLangKey = (state: PresidentPosition): LangTranslationKey => {
	switch (state) {
		case PresidentPosition.PRESIDENT:
			return LangTranslationKey.PRESIDENT
		case PresidentPosition.VICE_PRESIDENT:
			return LangTranslationKey.VICEPRESIDENT
		case PresidentPosition.Neutral:
			return LangTranslationKey.NEUTRAL
		case PresidentPosition.VICE_OLHO:
			return LangTranslationKey.VICEOLHO
		case PresidentPosition.OLHO:
			return LangTranslationKey.OLHO
		default:
			throw Error("Invalid presidentPlayerPosition")
			break;
	}
}

export const presidentDonationTypeToLangKey = (type: OlhoDonationType): LangTranslationKey => {
	switch (type) {
		case OlhoDonationType.OUTGOING:
			return LangTranslationKey.OUTGOING
		case OlhoDonationType.INCOMING:
			return LangTranslationKey.INCOMING
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
			return "text-confirm"
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
