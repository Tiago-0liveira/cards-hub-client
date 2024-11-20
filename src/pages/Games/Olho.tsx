import { apiPresidentPlayHand, apiPresidentRoomGetInfo, apiPresidentRoomStartGame, apiPresidentSkipHand, cards_value_compare } from "@/api/games/olho"
import { apiGameRoomSetUserReady, apiLeaveGameRoom } from "@/api/general"
import { getCardSrc } from "@/assetsManager"
import { Heading } from "@/components/custom/heading"
import { useAppSettings } from "@/components/providers/settings-provider"
import { useSocketContext } from "@/components/providers/socket-provider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { LangTranslationKey, OlhoDonationType, PresidentPlayerState, PresidentPosition, RoomStateBase, Suit } from "@/enums"
import { useCallback, useEffect, useState } from "react"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Socket } from "socket.io-client"
import { cx } from "class-variance-authority"
import { toast } from "sonner"
import { presidentDonationTypeToLangKey, presidentPlayerPositionToLangKey, presidentPlayerStateToLangKey } from "@/utils"
import Nav from "@/components/custom/nav"
import {Hand as HandIcon} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const Olho: React.FC<GameComponentProps> = ({ roomId }) => {
	const { lang } = useAppSettings()
	const { socket, user } = useSocketContext()
	const [presidentRoom, setPresidentRoom] = useState<PresidentRoom>()
	const [selectedCards, setSelectedCards] = useState<Card[]>([])
	const navigate = useNavigate()
	const userReady = useMemo(() => {
		const uReady = presidentRoom?.players.find(p => p.id === user?.id)
		return uReady?.ready
	}, [presidentRoom, user?.id])

	const handleGoBack = () => {
		apiLeaveGameRoom(socket as Socket, presidentRoom?.id ?? "", user?.id ?? "")
		navigate("/")
	}

	useEffect(() => {
		console.log("socket::", socket)
		console.log("user::", user)
		console.log("roomId::", roomId)


		socket?.on("presidentRoomInfo", ({ room: roomArg }: { room: PresidentRoom }) => {
			console.log("roomArg: ", roomArg);
			const r = roomArg;
			r.hands[user?.id ?? ""]?.hand.sort(cards_value_compare);
			setPresidentRoom(roomArg);
		})

		socket?.on("readyUpdate", (arg: { roomId: string; userId: string; ready: boolean }) => {
			setPresidentRoom((prev) => {
				const d: PresidentRoom | undefined = { ...prev };
				const p = d?.players?.find((u) => u.id === arg.userId);
				if (p) p.ready = arg.ready;
				return d;
			});
		})
		
		apiPresidentRoomGetInfo(socket as Socket, roomId, user?.id ?? "")
	}, [/*socket, roomId, user*/]);

	const handleCardClick = (card: Card) => (e) => {
		setSelectedCards(prev => {
			if (prev.find(c => c.suit === card.suit && c.value === card.value))
				return prev.filter(c => c.suit !== card.suit || c.value !== card.value)
			if (prev.every(c => c.value === card.value))
				return [...prev, card]
			toast("Error", {
				description: "You can only select cards with the same value", 
				action: {
					label: "Dismiss",
					onClick: () => {},
				},})
			return [...prev]
		})
	}

	const handleReadyButtonClick = (ready: boolean) => (e) => {
		apiGameRoomSetUserReady(socket as Socket, roomId, user?.id ?? "", !ready);
	}

	const handleGameStart = () => {
		apiPresidentRoomStartGame(socket as Socket, roomId)
	}

	const PresidentPlayerStateToTailwindClasses = (state: PresidentPlayerState): string => {
		switch (state) {
			case PresidentPlayerState.PASSED:
				return "text-muted-foreground"
			case PresidentPlayerState.WAITING:
				return "text-warning"
			case PresidentPlayerState.PLAYING:
				return "text-confirm"
			case PresidentPlayerState.FINNISHED:
				return "text-confirm"
			case PresidentPlayerState.LEFTROOM:
				return "text-warning"
			default:
				throw Error("Invalid presidentPlayerState")
				break;
		}
	}

	const PresidentPositionToTailwindClasses = (position: PresidentPosition): string => {
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

	const handlePlaySelectedCards = useCallback(() => {
		if (selectedCards.length === 0)
		{
			toast("Error", {
				description: "Your hand is empty!",
				action: {
					label: "Dismiss",
					onClick: () => {},
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
		<div className="olho size-full flex flex-col items-center bg-[url(/table4.jpg)] p-8 bg-no-repeat bg-cover">
			<Nav />
			<div className={`size-full max-w-screen-lg flex flex-col items-center pt-5 justify-between bg-center bg-no-repeat`}>
				<div className="buttons flex justify-around w-64">
					<Button variant="outline" onClick={handleGoBack}>Go back</Button>
					{presidentRoom?.state === RoomStateBase.ONGOING && presidentRoom?.hands[user?.id ?? ""]?.position !== PresidentPosition.Neutral && 
						<Collapsible>
							<CollapsibleTrigger asChild>
								<Button variant="outline">Donations Drawer</Button>
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
						</Collapsible>}
				</div>
				{presidentRoom?.state === RoomStateBase.ONGOING && 
					<div className="played-cards size-full flex flex-col items-center justify-center">
						<div className="hand flex mt-[10%]">
							{presidentRoom?.currentHand.length !== 0 && presidentRoom?.currentHand[presidentRoom?.currentHand.length - 1].map((card, index) => {
								const hand = presidentRoom?.currentHand[presidentRoom?.currentHand.length - 1] as Card[]
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
					</div>
				}
				<div className={cx("absolute players-list bg-card my-10 flex flex-col rounded-md border min-w-64 max-w-96 min-h-[50%] top-30 max-h-[80%] z-50", {"left-7": (presidentRoom?.state ?? RoomStateBase.IDLE) === RoomStateBase.ONGOING})}>
					<div className="title py-2">
						<Heading level={3}>Players List</Heading>
					</div>
					<Separator />

					<div className={cx("players flex-grow ")}>
						{presidentRoom?.state === RoomStateBase.IDLE && presidentRoom?.players.map((u) => 
							<div className="" key={u.id}>
								<div className="player flex h-10 justify-around items-center text-left">
									<span className="text-left flex-grow ml-3">{u.username}</span>
									<Separator orientation="vertical" />
									<span className={cx("text-center w-20", PresidentPositionToTailwindClasses(presidentRoom?.hands[u.id].position))}>{lang(presidentPlayerPositionToLangKey(presidentRoom?.hands[u.id]?.position))}</span>
									<Separator orientation="vertical" />
									<span className={cx("text-center w-24", {"text-confirm": u.ready, "text-warning": !u.ready})}>{u.ready ? "Ready" : "Not Ready"}</span>
								</div>
								<Separator />
							</div>
						)}
						{presidentRoom?.state === RoomStateBase.ONGOING && presidentRoom?.playerOrder.map((uId) => {
							const u = presidentRoom?.players.find(us => us.id === uId) as User
							return (<div className="" key={u.id}>
								<div className="player flex items-center justify-around h-10 text-left">
									{presidentRoom?.hands[uId].handSize === 0 ? 
										<>
											<span className="text-left flex-grow ml-6">{u.username}</span>
											<Separator orientation="vertical" />
											<span className="game-position text-center w-28">{lang(presidentPlayerPositionToLangKey(presidentRoom?.hands[uId].position))}</span>
										</>
										:
										<>
											
											<span className="w-4 text-center mr-2">{uId === presidentRoom?.lastPlayer && <HandIcon />}</span>
											<span className="text-left flex-1">{u.username}</span>
											<Separator orientation="vertical" />
											<span className={cx("w-20 text-center", PresidentPlayerStateToTailwindClasses(presidentRoom?.hands[u.id]?.state))}>
												{lang(presidentPlayerStateToLangKey(presidentRoom?.hands[u.id]?.state))}
											</span>
											<Separator orientation="vertical" />
											<span className="cardsNumber w-8 text-center">{presidentRoom?.hands[uId].handSize}</span>
										</>
									}
								</div>
								<Separator />
							</div>)}
						)}
					</div>

					{presidentRoom?.state === RoomStateBase.IDLE &&
						<>
							<Separator />
							<div className="relative bottom-0 py-2 flex justify-between px-7">
								{presidentRoom?.operator === user?.id && <Button onClick={handleGameStart} variant="outline" className="">Start</Button>}
								<Button onClick={handleReadyButtonClick(userReady ?? false)} variant="outline">{userReady ? "Unready" : "Ready"}</Button>
							</div>
						</>
					}
				</div>
				{presidentRoom?.hands[user?.id ?? ""]?.state === PresidentPlayerState.PLAYING && 
					<div className="fixed bg-card top-30 w-24 h-28 flex justify-evenly flex-col p-2 play-div border rounded-md right-10">
						<Button variant="outline" className="text-confirm" onClick={handlePlaySelectedCards}>Play Cards</Button>
						<Button variant="outline" className="text-warning" onClick={handleSkipRound}>Skip</Button>
					</div>
				}

				<div className="relative cards w-full h-[22rem] mt-auto">
					<div className="absolute size-full hover:translate-y-28 duration-150 translate-y-44">
						{presidentRoom?.state === RoomStateBase.ONGOING && presidentRoom?.hands[user?.id ?? ""]?.hand.map((card, index, arr) => {
							const cardImgPath = getCardSrc(card)
							return ( <div 
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
											${selectedCards.some(c => c.value === card.value && c.suit === card.suit) && "glowing-border"}
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

export default Olho