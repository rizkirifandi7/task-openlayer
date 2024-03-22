/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
      colors :{
        'btn-bg': "#1E1E2C",
        'slate-200': "#B7B7B7",
      }
    },
	},
	plugins: [],
};

