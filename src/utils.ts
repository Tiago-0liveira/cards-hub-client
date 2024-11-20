import { LangTranslationKey, OlhoDonationType, PresidentPlayerState, PresidentPosition } from "./enums";

export const presidentPlayerStateToLangKey = (state: PresidentPlayerState): LangTranslationKey => {
	switch (state) {
		case PresidentPlayerState.PASSED:
			return LangTranslationKey.PASSED
		case PresidentPlayerState.WAITING:
			return LangTranslationKey.WAITING
		case PresidentPlayerState.PLAYING:
			return LangTranslationKey.PLAYING
		case PresidentPlayerState.FINNISHED:
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

