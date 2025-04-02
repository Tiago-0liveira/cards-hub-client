/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
	theme: {
    	extend: {
			fontFamily: {
				ubuntu: ['Ubuntu', 'sans-serif'],
			},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		colors: {
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
				confirm: {
					DEFAULT: 'hsl(var(--confirm))',
    				foreground: 'hsl(var(--confirm-foreground))',
					hover: 'hsl(var(--confirm-hover))'
				},
				confirmDarker: {
					DEFAULT: 'hsl(var(--confirmDarker))',
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))',
					Darker: 'hsl(var(--destructiveDarker))'
    			},
				olhoPlayer: {
					DEFAULT: 'hsl(var(--olho-player-card-bg))',
					"position-box": 'hsl(var(--olho-player-card-position-box))'
				},
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
			gridTemplateColumns: {
				autoFit: 'repeat(auto-fit, minmax(24rem, 1fr))',
			},
			gridTemplateRows: {
				autoFit: 'repeat(auto-fit, minmax(3.5rem, 1fr))',
			}
    	}
    },
	plugins: [require("tailwindcss-animate")],
}