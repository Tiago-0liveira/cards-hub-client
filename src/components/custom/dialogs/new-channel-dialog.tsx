import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { LangKey } from '@/enums';
//import { DialogContent, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import { DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import React, { PropsWithChildren, useRef } from 'react';
import CustomDialog from '../custom-dialog';
import { useAppSettings } from '@/components/providers/settings-provider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X } from "lucide-react";
import GameTypeSwitch from '../switchs/game-type-switch';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';

export interface NewChannelDialog extends PropsWithChildren {
	onSubmit: (formData: FormData) => void,
	open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type FormData = {
	roomName: string;
	gameType: number;
};

const NewChannelDialog: React.FC<NewChannelDialog> = (props) => {
	const { lang } = useAppSettings();
	const formMethods = useForm<FormData>();
	const { register, handleSubmit, control, formState: { errors }, reset } = formMethods;
	const dialogCloseRef = useRef(null)

	const handleFormSubmit: SubmitHandler<FormData> = (data) => {
		console.log("here")
		if (Object.keys(errors).length === 0) {
			dialogCloseRef.current?.click();
			props.onSubmit(data)
			reset({ roomName: "", gameType: LangKey.OLHO })
			props.setOpen(false)
		}
	};


	return (
		<CustomDialog>
			<Button onClick={() => props.setOpen(true)} variant="outline" className="hover:text-confirm-foreground text-confirm-foreground hover:bg-confirm-hover bg-confirm ml-auto">
				{lang(LangKey.NEW_CHANNEL)}
			</Button>
			<DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[470px]">
				<form onSubmit={handleSubmit(handleFormSubmit)}>

					<DialogHeader className="relative">
						<DialogTitle className="text-xl font-bold">{lang(LangKey.CREATE_GAME_ROOM)}</DialogTitle>
						<DialogDescription className="text-muted-foreground">
							{lang(LangKey.CREATE_ROOM_DIALOG_DESCRIPTION)}
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 gap-4 items-center">
							{errors.roomName && <span className="text-red-500 text-sm text-left col-span-4">{errors.roomName.message}</span>}
							<Label htmlFor="roomName" className="text-right">{lang(LangKey.ROOM_NAME)}</Label>
							<div className="col-span-3 grid grid-cols-1 gap-1">
								<Input
									id="roomName"
									placeholder={lang(LangKey.ROOM_NAME)}
									className=""
									{...register("roomName", { required: "Room Name is required" })}
								/>
							</div>
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="gameType" className="text-right">{lang(LangKey.GAME)}</Label>
							<Controller
								name="gameType"
								control={control}
								defaultValue={LangKey.OLHO}  // Set a meaningful default value for gameType
								render={({ field }) => (
									<GameTypeSwitch
										value={field.value}
										onChange={field.onChange}
									/>
								)}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button type="submit" className="text-confirm-foreground hover:bg-confirm-hover bg-confirm">
							{lang(LangKey.CREATE_GAME_ROOM)}
						</Button>
						<DialogClose asChild>
							<button ref={dialogCloseRef} style={{ display: 'none' }}>{lang(LangKey.CLOSE)}</button>
						</DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>

		</CustomDialog>
	);
}

export default NewChannelDialog;