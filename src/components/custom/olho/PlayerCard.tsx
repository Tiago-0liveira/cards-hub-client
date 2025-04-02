import { useAppSettings } from '@/components/providers/settings-provider'
import { PresidentPlayerState, RoomStateBase } from '@/enums'
import { presidentPlayerPositionToLangKey, PresidentPlayerStateToTailwindClasses, PresidentPositionToTailwindClasses, UserReadyStateToTailwindClasses } from '@/utils/olho'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cx } from 'class-variance-authority'
import React, { useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AnimatePresence, motion } from 'framer-motion'
import { CrownIcon } from 'lucide-react';

export type OlhoPlayerCardProps = {
	room: PresidentRoom
	player: PresidentPlayer
	user: User
}

const getCircleColor = (room: PresidentRoom, player: PresidentPlayer, user: User, left: boolean = false) => {
	if (room.state === RoomStateBase.IDLE) {
		switch (user.ready) {
			case true:
				return "bg-green-600"
			case false:
				return "bg-yellow-600"
			default:
				throw new Error("Invalid user ready state")
		}
	}
	switch (!left ? player.state : player.lastState) {
		case PresidentPlayerState.PASSED:
			return "bg-gray-600"
		case PresidentPlayerState.WAITING:
			return "bg-yellow-400"
		case PresidentPlayerState.PLAYING:
			return "bg-green-600"
		case PresidentPlayerState.FINISHED:
			return "bg-blue-500"
		case PresidentPlayerState.LEFTROOM:
			return "bg-red-600"
		default:
			throw new Error("Invalid player state")
	}
}

const getCircleTooltip = (room: PresidentRoom, player: PresidentPlayer, user: User, left: boolean = false) => {
	if (room.state === RoomStateBase.IDLE) {
		switch (user.ready) {
			case true:
				return "Ready"
			case false:
				return "Not ready"
			default:
				throw new Error("Invalid user ready state")
		}
	}
	switch (!left ? player.state : player.lastState) {
		case PresidentPlayerState.PASSED:
			return "Passed"
		case PresidentPlayerState.WAITING:
			return "Waiting"
		case PresidentPlayerState.PLAYING:
			return "Playing"
		case PresidentPlayerState.FINISHED:
			return "Finished"
		case PresidentPlayerState.LEFTROOM:
			return "Left room"
		default:
			throw new Error("Invalid player state")
	}
}

const OlhoPlayerCard: React.FC<OlhoPlayerCardProps> = ({ room, player, user }) => {
	const { lang } = useAppSettings()

	
	const getHiddenState = () => {
		if (room.state === RoomStateBase.IDLE) return !room.rankedGame
		if (room.roundNumber === 1 && room.handNumber === 1 && room.rankedGame) return false
		if (player.handSize === 0) return false
		return true
	}
	const cardCount = player.handSize > 7 ? 7 : player.handSize
	const boxHidden = getHiddenState()

	return (
		<div className="OlhoPlayerCard relative w-60 h-28 flex items-center justify-center">
			<Avatar className={cx("player-image absolute z-20 top-[12%] left-[-3%] w-14 h-14")}>
				<AvatarImage src={`https://api.dicebear.com/7.x/adventurer/png?seed=${user.socketId}`} alt="api.dicebear.com fetched avatar" />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
			<motion.div
				className={cx("absolute z-0 flex w-36 h-12")}
				initial={{ x: 10, y: -17 }}
				whileHover={{ y: -40 }}
			>
				{cardCount !== 0 && 
					<div className="relative z-[2] cards-num font-ubuntu bg-olhoPlayer flex items-center justify-center rounded-lg h-8 w-8 left-[50%] top-[71%] translate-x-[-50%] translate-y-[-50%]">
						<span>{player.handSize}</span>
					</div>
				}
				<AnimatePresence>
					{Array(cardCount).fill(5).map((_, index) => (
						<motion.img
							key={index}
							src={"/svg/cards/back.svg"}
							className="absolute aspect-auto h-14"
							style={{
								left: `${index * 21 / cardCount}%`,
								transform: `translateX(${index * 11}px) translateY(${cardCount / 2}px) rotate(${(index - cardCount / 2) * 6}deg)`
							}}
							exit={{
								x: 50,
								opacity: 0
							}}
						/>
					))}
				</AnimatePresence>
			</motion.div>
			<div className={cx("black-box relative z-10 rounded-full bg-olhoPlayer p-2 flex items-center justify-normal w-56 h-12 shadow-2xl")}>
				<TooltipProvider delayDuration={100}>
					<Tooltip>
						<TooltipTrigger asChild>
							<span className="player-name font-ubuntu flex-1 text-xl text-left pl-10 p-2">
								{room.operator === user.id && <CrownIcon className="absolute text-yellow-500 translate-y-[-10px] translate-x-[-10px] rotate-[-9deg]" size={"20px"}/>}
								<span className={cx({"text-yellow-500": room.operator === user.id})}>
									{user.username.slice(0, 12)}{user.username.length > 12 && ".."}
								</span>
							</span>
						</TooltipTrigger>
						<TooltipContent className="bg-olhoPlayer text-white">
							<span className={cx({"text-yellow-500": room.operator === user.id})}>
								{user.username}
							</span>
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<span className={cx("relative p-2 m-2 w-5 h-5 rounded-full inline-block overflow-hidden",
								{ "glowing-border glow-green glow-lg": room.lastPlayer === user.id }
							)}>
								<span className={cx("absolute top-0 left-0 w-1/2 h-full", getCircleColor(room, player, user))}></span>
								<span className={cx("absolute top-0 right-0 w-1/2 h-full",
									player.state === PresidentPlayerState.LEFTROOM ? getCircleColor(room, player, user, true) : getCircleColor(room, player, user))
								}>
								</span>
							</span>
						</TooltipTrigger>
						<TooltipContent className="bg-olhoPlayer">
							<span className={cx("circle-tooltip")}>
								<span className={cx("left", room.state === RoomStateBase.ONGOING ? PresidentPlayerStateToTailwindClasses(player.state) : UserReadyStateToTailwindClasses(user.ready))}>{getCircleTooltip(room, player, user)}</span>
								{room.state === RoomStateBase.ONGOING && player.state === PresidentPlayerState.LEFTROOM && <>
									<span className="p-2 text-gray-400">/</span>
									<span className={cx("right", PresidentPlayerStateToTailwindClasses(player.lastState))}>{getCircleTooltip(room, player, user, true)}</span>
								</>}
							</span>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<motion.div 
				initial={{ y: 0 }}
				animate={boxHidden ? { y: 12 } : { y: 32 }}
				transition={{ duration: 0.5 }}
				className={cx(
					"position-box absolute text-md z-0 p-2 bg-olhoPlayer-position-box rounded-xl w-[65%]",
					PresidentPositionToTailwindClasses(player.position),
				)}>
				<span className="position">{lang(presidentPlayerPositionToLangKey(player.position))}</span>
			</motion.div>
		</div>
	)
}

export default OlhoPlayerCard