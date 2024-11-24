import { SoundName } from "./enums"

const BASE_AUDIO_PATH = "/sounds/"

function audio_path(sound: SoundName) {
	switch (sound)
	{
		case SoundName.READY_TO_PLAY:
			return BASE_AUDIO_PATH + "ready-to-play.wav"
		case SoundName.OLHO_ABAFADO:
			return BASE_AUDIO_PATH + "olho-abafado.wav"
		default:
			console.error(`Invalid sound: ${sound}`)
	}
}

const audios: Record<SoundName, HTMLAudioElement> = {
	[SoundName.READY_TO_PLAY]: new Audio(audio_path(SoundName.READY_TO_PLAY)),
	[SoundName.OLHO_ABAFADO]: new Audio(audio_path(SoundName.OLHO_ABAFADO)),
}

export function play_audio(sound: SoundName, volume: number) {
	const s = audios[sound]
	console.log(`play_audio::`, volume, volume / 100)
	s.muted = volume === 0
	s.volume = volume / 100
	if (s)
		s.play()
	else
		console.error(`Invalid sound: ${sound}`)
}

Object.values(audios).forEach(v => v.load())/* Load all audios */