/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                rose: {
                    400: '#fb7185',
                    500: '#f43f5e',
                    600: '#e11d48',
                    700: '#be123c',
                },
                purple: {
                    500: '#a855f7',
                    600: '#9333ea',
                },
                cyan: {
                    400: '#22d3ee',
                    500: '#06b6d4',
                },
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.5s ease-out',
                'scale-in': 'scaleIn 0.5s ease-out',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    'from': { boxShadow: '0 0 20px rgba(244, 63, 94, 0.5)' },
                    'to': { boxShadow: '0 0 40px rgba(244, 63, 94, 0.8), 0 0 60px rgba(168, 85, 247, 0.5)' },
                },
                slideUp: {
                    'from': { transform: 'translateY(20px)', opacity: '0' },
                    'to': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    'from': { transform: 'translateY(-20px)', opacity: '0' },
                    'to': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    'from': { transform: 'scale(0.9)', opacity: '0' },
                    'to': { transform: 'scale(1)', opacity: '1' },
                },
                shimmer: {
                    'from': { backgroundPosition: '0 0' },
                    'to': { backgroundPosition: '-200% 0' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-mesh': 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
