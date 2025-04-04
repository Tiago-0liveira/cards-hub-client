import { apiPresidentPlayHand, apiPresidentRoomGetInfo, apiPresidentRoomStartGame, apiPresidentSkipHand, cards_value_compare } from "@/api/games/olho"
import { apiGameRoomSetUserReady, apiLeaveGameRoom } from "@/api/general"
import { getCardSrc } from "@/assetsManager"
import Heading from "@/components/custom/heading"
import { useAppSettings } from "@/components/providers/settings-provider"
import { useSocketContext } from "@/components/providers/socket-provider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { LangKey, OlhoDonationType, PresidentLogType, PresidentPlayerState, PresidentPlayHandType, PresidentPosition, RoomStateBase, SoundName, Suit } from "@/enums"
import { useCallback, useEffect, useState } from "react"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Socket } from "socket.io-client"
import { cx } from "class-variance-authority"
import { toast } from "sonner"
import { presidentDonationTypeToLangKey, presidentPlayerPositionToLangKey, presidentPlayerStateToLangKey, PresidentPlayerStateToTailwindClasses, PresidentPositionToTailwindClasses } from "@/utils/olho"
import Nav from "@/components/custom/nav"
import { Crown, Hand as HandIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Nav2 from "@/components/custom/nav2"
import React from "react"
import OlhoPlayerCard from "@/components/custom/olho/playerCard"
import { motion } from "framer-motion"
import { useBanner } from "@/components/custom/banner-system/context"
import { BannerQueue } from "@/components/custom/banner-system/queue"
import OlhoJokerBanner from "@/components/custom/banner-system/banners/olho-joker-banner"
import olhoJokerBanner from "@/components/custom/banner-system/banners/olho-joker-banner"

const playerCardsPositions = [
	["top-[80%] left-[10%]"],/* bottom left */
	["top-[40%] left-[5%]"],/* middle left */
	["top-[0%] left-[10%]"],/* top left */
	["top-[-8%] right-[50%] translate-x-[50%]"],/* middle middle */
	["top-[0%] right-[10%]"],/* top right */
	["top-[40%] right-[5%]"],/* middle right */
	["top-[80%] right-[10%]"]/* bottom right */
]

const playerCardsLayouts: Record<number, number[]> = {
	[0]: [],
	[1]: [3],
	[2]: [1, 5],
	[3]: [1, 3, 5],
	[4]: [0, 2, 4, 6],
	[5]: [1, 2, 3, 4, 5],
	[6]: [0, 1, 2, 4, 5, 6],
	[7]: [0, 1, 2, 3, 4, 5, 6]
}

const Olho: React.FC<GameComponentProps> = ({ roomId }) => {
	const { lang, play_audio } = useAppSettings()
	const { socket, user } = useSocketContext()
	const [presidentRoom, setPresidentRoom] = useState<PresidentRoomDetailed>()
	const [selectedCards, setSelectedCards] = useState<Card[]>([])
	const navigate = useNavigate()
	const { addBanner } = useBanner()
	const userReady = useMemo(() => {
		const uReady = presidentRoom?.players.find(p => p.id === user?.id)
		return uReady?.ready
	}, [presidentRoom, user?.id])

	const handleGoBack = () => {
		apiLeaveGameRoom(socket as Socket, presidentRoom?.id ?? "", user?.id ?? "")
		navigate("/")
	}


	useEffect(() => {
		if (!socket) return;

		const handlePresidentRoomInfo = ({ room: roomArg }: { room: PresidentRoom }) => {
			console.log("roomArg: ", roomArg)
			console.log("winningPlayer: ", roomArg.players.find(u => u.id === roomArg.winningPlayer))
			const r = roomArg;
			r.hands[user?.id ?? ""]?.hand.sort(cards_value_compare);
			setPresidentRoom(before => {
				const updated: PresidentRoomDetailed = { ...r, logs: before?.logs ?? {} };
				if (before?.state === RoomStateBase.IDLE && updated.state === RoomStateBase.ONGOING) {
					updated.logs = {}
					setSelectedCards([])
				}
				updated.currentPlayer = Object.keys(updated.hands).find(k => updated.hands[k].state === PresidentPlayerState.PLAYING) ?? ""
				if (r.state === RoomStateBase.ONGOING) {
					if (!updated.logs[r.roundNumber]) {
						updated.logs[r.roundNumber] = []
					}

					const last2Hands = r.currentHand.slice(-2)

					if (r.roundNumber > 2 && updated.logs) {
						Object.keys(updated.logs).map(parseInt).filter(k => k <= r.roundNumber - 2).forEach(k => {
							delete updated.logs[k]
						})
					}
					if (updated.logs[r.roundNumber].find(log => log.handNumber === updated.handNumber) === undefined && (r.lastPlayer || (!r.lastPlayer && r.winningPlayer)) && r.lastPlayerAction !== PresidentPlayHandType.SKIP) {
						const toFindPlayerId = r.lastPlayer !== "" ? r.lastPlayer : r.winningPlayer
						const playerName = r.players.find(p => p.id === toFindPlayerId)?.username ?? "Player not found!"
						if (updated.lastPlayerAction === PresidentPlayHandType.JOKER) {
							const newLog = {
								player_username: playerName,
								hand: {
									type: PresidentLogType.HAND,
									cards: [{ value: "JOKER", suit: Suit.CLUBS } as Card]
								},
								handNumber: updated.handNumber
							}
							updated.logs[r.roundNumber - 1]?.push(newLog)
						}
						else if (last2Hands.length === 2 && last2Hands[0].length === last2Hands[1].length &&
							last2Hands[0].every((c, i) => c.value === last2Hands[1][i].value)) {
							updated.logs[r.roundNumber].push({
								player_username: playerName,
								hand: {
									type: PresidentLogType.BUFF,
									cards: r.currentHand.slice(-1)[0]
								},
								handNumber: updated.handNumber,
							})
						}
						else if (last2Hands.length !== 0) {
							const newLog = {
								player_username: playerName,
								hand: {
									type: PresidentLogType.HAND,
									cards: r.currentHand.slice(-1)[0]
								},
								handNumber: updated.handNumber
							}
							if (updated.lastPlayerAction !== PresidentPlayHandType.SKIP) {
								updated.logs[r.roundNumber].push(newLog)
							}
						}
					}
				}
				return updated
			});

		}

		const handleReadyUpdate = (arg: { roomId: string; userId: string; ready: boolean }) => {
			setPresidentRoom((prev) => {
				const d: PresidentRoomDetailed | undefined = { ...prev };
				const p = d?.players?.find((u) => u.id === arg.userId);
				if (p) p.ready = arg.ready;
				return d;
			});
		}

		socket?.on("presidentRoomInfo", handlePresidentRoomInfo)
		socket?.on("readyUpdate", handleReadyUpdate)
		apiPresidentRoomGetInfo(socket, roomId, user?.id ?? "")
		return () => {
			socket?.off("presidentRoomInfo", handlePresidentRoomInfo);
			socket?.off("readyUpdate", handleReadyUpdate);
		};
	}, [socket, roomId, user?.id]);

	useEffect(() => {
		const handlePlayAudio = (audioName: SoundName) => {
			if (audioName === SoundName.JOKER) {
				addBanner(olhoJokerBanner)
			}
			else
				play_audio(audioName);
		}
		socket?.on("play_audio", handlePlayAudio)

		return () => {
			socket?.off("play_audio", handlePlayAudio);
		};
	}, [socket, play_audio, addBanner]);

	const handleCardClick = (card: Card) => () => {
		setSelectedCards(prev => {
			if (prev.find(c => c.suit === card.suit && c.value === card.value))
				return prev.filter(c => c.suit !== card.suit || c.value !== card.value)
			if (prev.every(c => c.value === card.value))
				return [...prev, card]
			toast("Error", {
				description: "You can only select cards with the same value",
				action: {
					label: "Dismiss",
					onClick: () => { },
				},
			})
			return [...prev]
		})
	}

	const handleReadyButtonClick = (ready: boolean) => () => {
		apiGameRoomSetUserReady(socket as Socket, roomId, user?.id ?? "", !ready);
	}

	const handleGameStart = () => {
		apiPresidentRoomStartGame(socket as Socket, roomId)
	}

	const handlePlaySelectedCards = useCallback(() => {
		if (selectedCards.length === 0) {
			toast("Error", {
				description: "Your hand is empty!",
				action: {
					label: "Dismiss",
					onClick: () => { },
				}
			})
			return
		}
		apiPresidentPlayHand(socket as Socket, roomId, user?.id ?? "", selectedCards)
		setSelectedCards([])
	}, [socket, roomId, user, selectedCards])

	const handleSkipRound = () => {
		apiPresidentSkipHand(socket as Socket, roomId, user?.id ?? "")
	}

	return (
		<div className="olho size-full flex flex-col items-center bg-[url(/olho-background2.png)] bg-center bg-no-repeat bg-cover">
			<Nav2 />
			<BannerQueue />
			<div className={`size-full max-w-screen-lg flex flex-col items-center justify-between bg-center bg-no-repeat`}>
				<div className="buttons flex justify-around w-64">
					<Button variant="outline" onClick={handleGoBack}>{lang(LangKey.GO_BACK)}</Button>
					{presidentRoom?.state === RoomStateBase.ONGOING &&
						<>{/* Donations Drawer and Game Logs */}
							{presidentRoom?.hands[user?.id ?? ""].handSize !== 0 && presidentRoom?.hands[user?.id ?? ""]?.position !== PresidentPosition.Neutral &&
								<Collapsible>
									<CollapsibleTrigger asChild>
										<Button variant="outline">{lang(LangKey.DONATIONS_DRAWER)}</Button>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<div className="donation-drawer-content z-10 absolute w-80 -translate-x-1/4 bg-card border rounded-lg">
											<div className="donation-incoming size-full">
												<div className="h-10 py-2">
													<span className="">
														{lang(presidentDonationTypeToLangKey(OlhoDonationType.INCOMING))}
													</span>
												</div>
												<Separator />
												<div className="cards flex justify-evenly m-4">
													{presidentRoom?.hands[user?.id ?? ""]?.donations.find(d => d.type === OlhoDonationType.INCOMING)?.cards.map(card => {
														const cardSrc = getCardSrc(card)
														return (<img className="w-20 rounded-sm" src={cardSrc} alt={cardSrc} />)
													})}
												</div>
											</div>
											<Separator />
											<div className="donation-outgoing ">
												<div className="h-10 py-2">
													<span className="">
														{lang(presidentDonationTypeToLangKey(OlhoDonationType.OUTGOING))}
													</span>
												</div>

												<Separator />
												<div className="cards flex justify-evenly m-4">
													{presidentRoom?.hands[user?.id ?? ""]?.donations.find(d => d.type === OlhoDonationType.OUTGOING)?.cards.map(card => {
														const cardSrc = getCardSrc(card)
														return (<img className="w-20 rounded-sm" src={cardSrc} alt={cardSrc} key={cardSrc} />)
													})}
												</div>
											</div>
										</div>
									</CollapsibleContent>
								</Collapsible>
							}
							<Collapsible>
								<CollapsibleTrigger asChild>
									<Button variant="outline">{lang(LangKey.LOGS)}</Button>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<div className="game-logs-content z-10 absolute right-0 w-80 bg-card border rounded-lg max-h-[500px] flex flex-col">
										{Object.keys(presidentRoom?.logs ?? []).length === 0 ? (
											<div className="log flex-1 flex items-center justify-center">
												{lang(LangKey.EMPTY)}
											</div>
										) : (
											<div className="flex-1"> {/* Ensures the logs can scroll properly */}
												{Object.keys(presidentRoom?.logs ?? []).map((logKey, index) => (
													<div className="log-round flex flex-col" key={index}>
														<span className="log-round-title">{lang(LangKey.ROUND)} {parseInt(logKey)}</span>
														<Separator />
														<div className="overflow-y-auto custom-scrollbar max-h-[200px]"> {/* Set a reasonable height */}
															{presidentRoom?.logs[parseInt(logKey)]?.length === 0 ? (
																<span className="log-text">{lang(LangKey.NO_ONE_PLAYED)}</span>
															) : (
																presidentRoom?.logs[parseInt(logKey)]?.map((log, index) => (
																	<div className="log flex items-center w-full" key={index}>
																		<div className="player w-20">{log.player_username}</div>
																		<div className="hand flex flex-1 justify-around">
																			{log.hand.cards?.map((card) => {
																				const cardSrc = getCardSrc(card);
																				return <img className="w-10 rounded-sm" src={cardSrc} alt={cardSrc} key={cardSrc} />;
																			})}
																		</div>
																	</div>
																))
															)}
														</div>
														<Separator />
													</div>
												))}
											</div>
										)}
									</div>

								</CollapsibleContent>
							</Collapsible>
						</>}
				</div>
				{presidentRoom && presidentRoom.state === RoomStateBase.ONGOING &&
					<div className="relative played-cards select-none flex flex-col mt-40 w-full h-2/5 items-center justify-evenly">

						{/* LastPlayer hand by: */}
						{presidentRoom.lastPlayer !== "" &&
							<div className="absolute top-2 h-10 lastplay-by border rounded-md bg-olhoPlayer flex items-center">
								<span className="p-4 lastplayer-name">{presidentRoom.players.find(u => u.id === presidentRoom.lastPlayer)?.username}</span>
								<Separator className="" orientation="vertical" />
								<span className={cx("p-4 lastplayer-rank", PresidentPositionToTailwindClasses(presidentRoom.hands[presidentRoom.lastPlayer]?.position))}>
									{lang(presidentPlayerPositionToLangKey(presidentRoom.hands[presidentRoom.lastPlayer]?.position))}
								</span>
							</div>
						}

						{/* LastPlayer hand */}
						<div className="hand flex">
							{presidentRoom.currentHand.length !== 0 && presidentRoom.currentHand[presidentRoom.currentHand.length - 1].map((card, index) => {
								const hand = presidentRoom.currentHand[presidentRoom.currentHand.length - 1] as Card[]
								const csrc = getCardSrc(card)
								return <img className="w-24 rounded-sm duration-300 animate-in animate-out"
									style={{
										left: `${index * 81 / hand.length - 4}%`,
										transform: `translateX(${index * 13}px) rotate(${(index - hand.length / 2) * 2}deg)`
									}}
									src={csrc} alt={csrc} key={csrc}
								/>
							})}
						</div>

						{/* Play and Skip buttons */}
						{presidentRoom.state === RoomStateBase.ONGOING && presidentRoom.hands[user?.id ?? ""]?.state === PresidentPlayerState.PLAYING &&
							<div className="absolute bottom-[-2rem] z-40 flex justify-evenly p-2 play-div /*border rounded-md bg-card*/">
								<Button variant="outline" className="text-confirm" onClick={handlePlaySelectedCards}>{lang(LangKey.PLAY_CARDS)}</Button>
								<Button variant="outline" className="text-warning ml-4" onClick={handleSkipRound}>{lang(LangKey.SKIP)}</Button>
							</div>
						}
					</div>
				}
				{/* Players List */}
				{presidentRoom && presidentRoom.state === RoomStateBase.IDLE &&
					<div className="lobby-buttons z-40 flex w-52 align-center absolute bottom-[25%] justify-around">
						{presidentRoom?.operator === user?.id && <Button onClick={handleGameStart} variant="outline" className="">{lang(LangKey.START)}</Button>}
						<Button onClick={handleReadyButtonClick(userReady ?? false)} variant="outline">{lang(userReady ? LangKey.NOT_READY : LangKey.READY)}</Button>
					</div>
				}
				{presidentRoom &&
					<div className="players absolute top-[20%] w-[75%] h-[62%]">
						{playerCardsLayouts[presidentRoom?.players.length ?? 0].map((positionIndex, i) => {
							const player = presidentRoom.players[i]
							const u = presidentRoom.hands[player.id]
							return <div className={cx(playerCardsPositions[positionIndex], "absolute")} key={player.id}>
								<OlhoPlayerCard room={presidentRoom} player={u} user={player} />
							</div>
						})}

					</div>
				}
				<div className="relative cards z-30 w-full h-[14rem] mt-auto">
					<div className="absolute size-full hover:translate-y-20 duration-150 translate-y-36">
						{presidentRoom?.state === RoomStateBase.ONGOING && presidentRoom?.hands[user?.id ?? ""]?.hand.map((card, index, arr) => {
							const cardImgPath = getCardSrc(card)
							return (<div
								className={"card absolute w-26 hover:!translate-y-[-10rem]  rounded-xl  duration-300 animate-in animate-out delay-50"}
								style={{
									left: `${index * 81 / arr.length - 4}%`,
									transform: `translateX(${index * 13}px) translateY(${arr.length / 2 - index}px) rotate(${(index - arr.length / 2) * 3}deg)`
								}}
								key={`${card.value}-${card.suit}-${index}`}
								onClick={handleCardClick(card)}
							>
								<img src={cardImgPath} alt={cardImgPath}
									className={`
											rounded-xl
											${selectedCards.some(c => c.value === card.value && c.suit === card.suit) && "glowing-border glow-blue glow-lg"}
										`}
								/>
							</div>)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}

export default React.memo(Olho)