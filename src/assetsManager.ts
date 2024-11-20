import { Suit } from "@/enums"

const BASE_CARDS_PATH = "/svg/cards/"

const IMGS_SRCS: Record<string, string[]> = {
	"2":  ["2_of_diamonds", "2_of_clubs", "2_of_hearts", "2_of_spades",], 
	"3":  ["3_of_diamonds", "3_of_clubs", "3_of_hearts", "3_of_spades",], 
	"4":  ["4_of_diamonds", "4_of_clubs", "4_of_hearts", "4_of_spades",], 
	"5":  ["5_of_diamonds", "5_of_clubs", "5_of_hearts", "5_of_spades",], 
	"6":  ["6_of_diamonds", "6_of_clubs", "6_of_hearts", "6_of_spades",], 
	"7":  ["7_of_diamonds", "7_of_clubs", "7_of_hearts", "7_of_spades",], 
	"8":  ["8_of_diamonds", "8_of_clubs", "8_of_hearts", "8_of_spades",], 
	"9":  ["9_of_diamonds", "9_of_clubs", "9_of_hearts", "9_of_spades",], 
	"10": ["10_of_diamonds", "10_of_clubs", "10_of_hearts", "10_of_spades",], 
	"J":  ["J_of_diamonds2", "J_of_clubs2", "J_of_hearts2", "J_of_spades2",], 
	"Q":  ["Q_of_diamonds2", "Q_of_clubs2", "Q_of_hearts2", "Q_of_spades2",], 
	"K":  ["K_of_diamonds2", "K_of_clubs2", "K_of_hearts2", "K_of_spades2",], 
	"A":  ["A_of_diamonds", "A_of_clubs", "A_of_hearts", "A_of_spades2",],
	"JOKER": ["red_joker", "black_joker"]
}

export const getCardSrc = (card: Card): string => {
	return BASE_CARDS_PATH + IMGS_SRCS[card.value][card.suit as Suit] + ".svg"
}
