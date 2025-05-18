
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'var(--border-neutral)',
				input: 'var(--border-neutral)',
				ring: 'var(--focus-ring)',
				background: 'var(--bg-main)',
				surface: 'var(--bg-surface)',
				'surface-2': 'var(--bg-surface-2)',
				foreground: 'var(--text-primary)',
				primary: {
					DEFAULT: 'var(--accent)',
					hover: 'var(--accent-hover)',
					active: 'var(--accent-active)',
					foreground: 'var(--text-primary)'
				},
				secondary: {
					DEFAULT: 'var(--bg-surface-2)',
					foreground: 'var(--text-primary)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'var(--bg-surface)',
					foreground: 'var(--text-secondary)'
				},
				accent: {
					DEFAULT: 'var(--accent)',
					hover: 'var(--accent-hover)',
					active: 'var(--accent-active)',
					foreground: 'var(--text-primary)'
				},
				popover: {
					DEFAULT: 'var(--bg-surface)',
					foreground: 'var(--text-primary)'
				},
				card: {
					DEFAULT: 'var(--bg-surface)',
					foreground: 'var(--text-primary)'
				},
				sidebar: {
					DEFAULT: 'var(--bg-surface)',
					foreground: 'var(--text-secondary)',
					primary: 'var(--accent)',
					'primary-foreground': 'var(--text-primary)',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'var(--border-neutral)',
					ring: 'var(--focus-ring)'
				},
				story: {
					purple: '#9b87f5',
					lightPurple: '#D6BCFA',
					softGreen: '#F2FCE2',
					softYellow: '#FEF7CD',
					softBlue: '#D3E4FD',
					softPink: '#FFDEE2'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 3s ease-in-out infinite'
			},
			boxShadow: {
				'elevation': 'var(--shadow)'
			},
			transitionDuration: {
				'DEFAULT': '150ms'
			},
			transitionTimingFunction: {
				'DEFAULT': 'ease-in-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
