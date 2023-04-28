import { type Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            backgroundColor: {
                "discord-dark": "#313338",
                "discord-mention": "#5865f2",
                "discord-darker": "#2B2D31",
            },
            backgroundImage: {
                polygon: "url('/../polygon.png')",
            },
        },
    },
    plugins: [],
} satisfies Config;
