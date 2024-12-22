import { scan } from 'react-scan'; // import this BEFORE react
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {createTheme, ThemeProvider} from "@mui/material";

if (typeof window !== 'undefined') {
    scan({
        enabled: true,
        log: false, // prints re-renders to the console
        showToolbar: true,
        playSound: false,
    });
}

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        // Optionally customize other colors as needed, e.g.:
        // primary: {
        //   main: '#90caf9',
        // },
        // background: {
        //   default: '#121212',
        // },
    },
});

createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={darkTheme}>
        <App />
    </ThemeProvider>
)
