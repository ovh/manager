/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        colors: {
			      primary: {
				        50: '#F5FEFF',
				        75: '#D3F8FF',
				        100: '#BEF1FF',
				        200: '#85D9FD',
				        300: '#4BB2F6',
				        400: '#157EEA',
				        500: '#0050D7',
				        600: '#002DBE',
				        700: '#000E9C',
				        800: '#00185E',
				        900: '#000D1F'
			      },
			      success: {
				        50: '#E7F7DF',
				        100: '#D2F2C2',
				        200: '#90CC7A',
				        300: '#64B347',
				        400: '#47991F',
				        500: '#2B8000',
				        600: '#267300',
				        700: '#226600',
				        800: '#1A4D00',
				        900: '#113300'
			      },
			      error: {
				        50: '#FFE6EC',
				        100: '#FFCCD9',
				        200: '#EF99AB',
				        300: '#E67386',
				        400: '#CF334E',
				        500: '#BF0020',
				        600: '#A6001C',
				        700: '#800015',
				        800: '#660011',
				        900: '#4D000D'
			      },
			      gray: {
				        50: '#f2f2f2',
				        100: '#e6e6e6',
				        200: '#cccccc',
				        300: '#b3b3b3',
				        400: '#999999',
				        500: '#808080',
				        600: '#666666',
				        700: '#4d4d4d',
				        800: '#333333',
				        900: '#1a1a1a'
			      },
			      warning: {
				        50: '#fff7cc',
				        100: '#feea86',
				        200: '#fed265',
				        300: '#ffbb43',
				        400: '#ffa322',
				        500: '#ff8b00',
				        600: '#cc7000',
				        700: '#995400',
				        800: '#663800',
				        900: '#4d2a00'
			      },
			      white: '#fff',
			      secondary: '#4d5592',
			      ecorange: '#dffe81',
            transparent: 'transparent'
		    },
        fontFamily: {
			      sans: ['Source Sans Pro', 'sans-serif'],
			      serif: ['Source Sans Pro', 'serif']
		    },
        text: {
				    sm: '0.875rem',
				    md: '1rem',
				    lg: '1.25rem',
				    xl: '1.5rem',
				    '2xl': '1.75rem',
				    '3xl': '2.25rem',
				    '4xl': '3.375rem'
			  },
        extend: {
            spacing: {
				        sm: '0.75rem',
				        md: '1rem',
				        lg: '1.25rem',
				        xl: '1.5rem',
				        '2xl': '2rem',
				        '3xl': '2.5rem',
				        '4xl': '3rem'
			      }
        },
    },
    plugins: [],
}
