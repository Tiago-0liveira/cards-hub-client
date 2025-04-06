import { getCardSrc } from '@/assetsManager'
import { cx } from 'class-variance-authority'
import { motion } from 'framer-motion'
import React from 'react'

interface DynamicCardProps extends React.HTMLAttributes<HTMLDivElement> {
	card: Card
	selected: boolean,
	handleCardClick: (card: Card) => () => void
	horizontalShift: number
	angle: number
}

const DynamicCard: React.FC<DynamicCardProps> = ({ selected, card, handleCardClick, horizontalShift, angle }) => {
	return (
		<motion.div
			className={cx(
				"absolute top-0 w-56 rounded-md will-change-transform",
				{ "glowing-border glow-blue glow-lg": selected }
			)}
			onClick={handleCardClick(card)}
			initial={{
				translateY: 100,
				opacity: 0,
				transition: { duration: 0.35, staggerChildren: 0.1 }
			}}
			animate={{
				opacity: 1,
				translateX: `${horizontalShift}px`,
				rotate: angle,
				transition: { duration: 0.3, type: "keyframes", ease: "circInOut", stiffness: 100, damping: 100 },
			}}
			exit={{
				opacity: 0
			}}
			whileHover={{
				translateY: -50,
				rotate: angle / 2.5,
				transition: { duration: 0.25, type: "keyframes", ease: "easeOut" },
			}}
		>
			<img
				src={getCardSrc(card)}
				alt={getCardSrc(card)}
				className={cx("w-full rounded-md")}
			/>
		</motion.div>
	)
}

export default React.memo(DynamicCard)