import { getCardSrc } from '@/assetsManager';
import { useAppSettings } from '@/components/providers/settings-provider';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { LangKey } from '@/enums';
import { Separator } from '@radix-ui/react-select';
import React from 'react'

interface GameLogsProps extends React.HTMLAttributes<HTMLDivElement> {
	presidentRoom: PresidentRoomDetailed
}

const GameLogs: React.FC<GameLogsProps> = ({ presidentRoom }) => {
	const { lang } = useAppSettings()

	return (
		<Collapsible>
			<CollapsibleTrigger asChild>
				<Button variant="outline">{lang(LangKey.LOGS)}</Button>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div className="game-logs-content z-10 absolute right-0 w-80 bg-card border rounded-lg max-h-[500px] flex flex-col">
					{Object.keys(presidentRoom.logs).length === 0 ? (
						<div className="log flex-1 flex items-center justify-center">
							{lang(LangKey.EMPTY)}
						</div>
					) : (
						<div className="flex-1"> {/* Ensures the logs can scroll properly */}
							{Object.keys(presidentRoom.logs).map((logKey, index) => (
								<div className="log-round flex flex-col" key={index}>
									<span className="log-round-title">{lang(LangKey.ROUND)} {parseInt(logKey)}</span>
									<Separator />
									<div className="overflow-y-auto custom-scrollbar max-h-[200px]"> {/* Set a reasonable height */}
										{presidentRoom.logs[parseInt(logKey)]?.length === 0 ? (
											<span className="log-text">{lang(LangKey.NO_ONE_PLAYED)}</span>
										) : (
											presidentRoom.logs[parseInt(logKey)]?.map((log, index) => (
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
	)
}

export default React.memo(GameLogs)