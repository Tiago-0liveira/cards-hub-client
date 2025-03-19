import { SoundName } from "./enums"

const BASE_AUDIO_PATH = "/sounds/"

function audio_path(sound: SoundName) {
	switch (sound) {
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

const audioQueue: { sound: SoundName; volume: number }[] = [];
let isPlaying = false; // Tracks if any sound is playing

function playNextInQueue() {
	if (audioQueue.length === 0) {
		isPlaying = false;
		return;
	}

	isPlaying = true;
	const { sound, volume } = audioQueue.shift()!; // Get next sound
	const s = audios[sound];

	if (!s) {
		console.error(`Invalid sound: ${sound}`);
		playNextInQueue(); // Try next sound if invalid
		return;
	}

	s.volume = volume / 100;
	s.muted = volume === 0;

	s.onended = null;
	s.onended = () => playNextInQueue(); // When finished, play next sound
	s.play().catch(err => console.error("Audio play error:", err));
}

export function play_audio(sound: SoundName, volume: number) {
	audioQueue.push({ sound, volume }); // Add sound to queue

	if (!isPlaying) {
		playNextInQueue(); // Start queue if nothing is playing
	}
}

Object.values(audios).forEach(v => v.load())/* Load all audios */