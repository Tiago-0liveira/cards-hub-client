import React from 'react';
import { cn } from '@/lib/utils'; // if you're using a utility to handle conditional classes

type HeadingProps = {
	level?: 1 | 2 | 3 | 4 | 5 | 6;
	className?: string;
};

export const Heading: React.FC<React.PropsWithChildren<HeadingProps>> = ({ level = 1, className, children }) => {
	const headingStyles = {
		1: "text-4xl font-bold tracking-tight",
		2: "text-3xl font-bold",
		3: "text-2xl font-medium",
		4: "text-xl font-medium",
		5: "text-lg font-medium",
		6: "text-base font-medium",
	};

	return (
		<span className={cn(headingStyles[level], className)}>
			{children}
		</span>
	);
};
