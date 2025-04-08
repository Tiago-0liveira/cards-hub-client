import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { LangKey } from '@/enums';
import { DialogContent, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import React, { PropsWithChildren, useEffect, useRef } from 'react';
import CustomDialog from '../custom-dialog';
import { useAppSettings } from '@/components/providers/settings-provider';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { LoaderCircleIcon, X } from "lucide-react";
import GameTypeSwitch from '../switchs/game-type-switch';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import type { Socket } from 'socket.io-client';

export interface CreateUserDialog extends PropsWithChildren {
	onSubmit: (formData: FormData) => void,
	open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>,
	user: User | null,
	socket: Socket | null
}

export type FormData = {
	username: string;
}

const CreateUserDialog: React.FC<CreateUserDialog> = (props) => {
	const { lang } = useAppSettings();
	const formMethods = useForm<FormData>();
	const { register, handleSubmit, formState: { errors }, reset } = formMethods;
	const dialogCloseRef = useRef(null)
	const TriggerButtonRef = useRef(null)

	const handleFormSubmit: SubmitHandler<FormData> = (data) => {
		if (Object.keys(errors).length === 0) {
			dialogCloseRef.current?.click();
			props.onSubmit(data)
			reset({ username: "" })
			props.setOpen(false)
		}
	};

	return (
		<CustomDialog open={props.user === null} onOpenChange={(open) => {
			if ((props.user === null || props.user === undefined) && !open) {
				TriggerButtonRef.current?.click()
			}
		}}>
			<Button ref={TriggerButtonRef} onClick={() => props.setOpen(true)} variant="outline" style={{ "display": "none" }}>
				{lang(LangKey.NEW_CHANNEL)}
			</Button>
			<DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[470px]">
				{!props.socket || !props.socket.connected ? 
					<div className="">
						<DialogHeader className="relative">
							<DialogTitle className="text-xl font-bold">{lang(LangKey.COULD_NOT_CONNECT_TO_SERVER)}</DialogTitle>
							<DialogDescription className="text-muted-foreground mt-auto flex items-center">
								<span>{lang(LangKey.CONNECTING_TO_SERVER)}</span>
								<LoaderCircleIcon className="animate-spin ml-2 text-warning" size={16}  />
							</DialogDescription>
						</DialogHeader>
					</div>
				:
					<form onSubmit={handleSubmit(handleFormSubmit)}>
						<DialogHeader className="relative">
							<DialogTitle className="text-xl font-bold">{lang(LangKey.CHOOSE_YOUR_USERNAME)}</DialogTitle>
							<DialogDescription className="text-muted-foreground mt-auto">
								{lang(LangKey.USERNAME_DIALOG_DESCRIPTION)}
							</DialogDescription>
						</DialogHeader>

						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 gap-4 items-center">
								{errors.username && <span className="text-red-500 text-sm text-left col-span-4">{errors.username.message}</span>}
								<Label htmlFor="username" className="text-right">{lang(LangKey.USER_NAME)}</Label>
								<div className="col-span-3 grid grid-cols-1 gap-1">
									<Input
										id="username"
										placeholder={lang(LangKey.USER_NAME)}
										className=""
										{...register("username", { required: "User Name is required" })}
									/>
								</div>
							</div>
						</div>

						<DialogFooter>
							<Button type="submit" className="text-confirm-foreground hover:bg-confirm-hover bg-confirm">
								{lang(LangKey.CREATE_USER)}
							</Button>
							<DialogClose asChild>
								<button ref={dialogCloseRef} style={{ display: 'none' }}>{lang(LangKey.CLOSE)}</button>
							</DialogClose>
						</DialogFooter>
					</form>
				}
			</DialogContent>

		</CustomDialog>
	);
}

export default React.memo(CreateUserDialog);