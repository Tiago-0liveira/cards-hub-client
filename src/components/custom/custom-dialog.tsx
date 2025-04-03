import React, { PropsWithChildren, useEffect } from 'react';
import { LangKey } from '@/enums';
import lang from '@/lang';
import { DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogOverlay, DialogTrigger } from '@/components/ui/dialog';
import { DialogProps } from '@radix-ui/react-dialog';

interface CompleteDialogProps extends PropsWithChildren, DialogProps {
	onOpenChange?: (open: boolean) => void
}

/* Takes first child as the trigger */
const CompleteDialog: React.FC<CompleteDialogProps> = ({ children, ...props }) => {
	if (!(Array.isArray(children) && children.length >= 2)) throw Error("Invalid Children")

	return (
		<Dialog onOpenChange={props.onOpenChange ?? (() => { })} {...props}>
			<DialogOverlay className="bg-black/70 fixed inset-0 transition-opacity" />
			<DialogTrigger asChild>
				{children[0]}
			</DialogTrigger>
			{[...children.slice(1)]}
		</Dialog>
	);
}

export default CompleteDialog;