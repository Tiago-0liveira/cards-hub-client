import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { LangTranslationKey } from '@/enums';
import { DialogContent, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import React, { PropsWithChildren, useEffect, useRef } from 'react';
import CustomDialog from '../custom-dialog';
import { useAppSettings } from '@/components/providers/settings-provider';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { X } from "lucide-react";
import GameTypeSwitch from '../switchs/game-type-switch';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';

export interface CreateUserDialog extends PropsWithChildren {
	onSubmit: (formData: FormData) => void,
	open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>,
	user: User | null,
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
			reset({username: ""})
			props.setOpen(false)
        }
    };

	return (
		<CustomDialog open={props.user === null} onOpenChange={(open) => {
			if ((props.user === null || props.user === undefined) && !open)
			{
				TriggerButtonRef.current?.click()
			}
		}}>
			<Button ref={TriggerButtonRef} onClick={() => props.setOpen(true)} variant="outline" style={{"display": "none"}}>
				{lang(LangTranslationKey.NEW_CHANNEL)}
			</Button>
			<DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[470px]">
				<form onSubmit={handleSubmit(handleFormSubmit)}>
					<DialogHeader className="relative">
						<DialogTitle className="text-xl font-bold">{lang(LangTranslationKey.CHOOSE_YOUR_USERNAME)}</DialogTitle>
						<DialogDescription className="text-muted-foreground mt-auto">
							{lang(LangTranslationKey.USERNAME_DIALOG_DESCRIPTION)}
						</DialogDescription>
					</DialogHeader>
					
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 gap-4 items-center">
							{errors.username && <span className="text-red-500 text-sm text-left col-span-4">{errors.username.message}</span>}
							<Label htmlFor="username" className="text-right">{lang(LangTranslationKey.USER_NAME)}</Label>
							<div className="col-span-3 grid grid-cols-1 gap-1">
								<Input 
									id="username" 
									placeholder={lang(LangTranslationKey.USER_NAME)}
									className=""
									{...register("username", { required: "User Name is required" })}
								/>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button type="submit" className="text-confirm-foreground hover:bg-confirm-hover bg-confirm">
							{lang(LangTranslationKey.CREATE_USER)}
						</Button>
						<DialogClose asChild>
                            <button ref={dialogCloseRef} style={{ display: 'none' }}>Close</button>
                        </DialogClose>
					</DialogFooter>
				</form>
			</DialogContent>

		</CustomDialog>
	);
}

export default CreateUserDialog;