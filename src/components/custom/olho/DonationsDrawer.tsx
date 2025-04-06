import { getCardSrc } from '@/assetsManager'
import { useAppSettings } from '@/components/providers/settings-provider'
import { Button } from '@/components/ui/button'
import { LangKey, OlhoDonationType } from '@/enums'
import lang from '@/lang'
import { presidentDonationTypeToLangKey } from '@/utils/olho'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@radix-ui/react-collapsible'
import { Separator } from '@radix-ui/react-select'
import React, { useCallback, useMemo } from 'react'

interface DonationsDrawerProps extends React.HTMLAttributes<HTMLDivElement> {
	presidentRoom: PresidentRoom
	user: User
}

type DonationsPrepared = {
	in: Card[], out: Card[]
}

export const DonationsDrawer: React.FC<DonationsDrawerProps> = ({ presidentRoom, user }) => {
	const { lang } = useAppSettings()
	const donations: DonationsPrepared = useMemo(() => {
		const res: DonationsPrepared = { in: [], out: [] }
		presidentRoom.hands[user.id].donations.forEach(d => {
			if (d.type === OlhoDonationType.INCOMING) {
				res.in = d.cards
			} else if (d.type === OlhoDonationType.OUTGOING) {
				res.out = d.cards
			}
		})
		return res
	},
	[presidentRoom.hands, user.id])


	return (
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
							{donations.in.map(card => {
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
							{donations.out.map(card => {
								const cardSrc = getCardSrc(card)
								return (<img className="w-20 rounded-sm" src={cardSrc} alt={cardSrc} key={cardSrc} />)
							})}
						</div>
					</div>
				</div>
			</CollapsibleContent>
		</Collapsible>
	)
}

export default React.memo(DonationsDrawer)