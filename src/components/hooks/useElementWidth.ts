import { useEffect, useState } from 'react';

const useElementWidth = (ref: React.RefObject<HTMLElement>, defaultValue: number) => {
	const [width, setWidth] = useState<number | null>(null);

	useEffect(() => {
		const updateWidth = () => {
			if (ref.current) {
				setWidth(ref.current.getBoundingClientRect().width);
			}
		};

		updateWidth();
		window.addEventListener('resize', updateWidth);
		return () => window.removeEventListener('resize', updateWidth);
	}, [ref]);

	if (width === null) {
		return defaultValue;
	}
	return width;
}

export default useElementWidth;