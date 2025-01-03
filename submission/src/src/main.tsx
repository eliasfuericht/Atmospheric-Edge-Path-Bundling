import { createRoot } from 'react-dom/client'
import './index.css'
import {createTheme, ThemeProvider} from "@mui/material";
import {App} from "./App.tsx";

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

/**
 * This is the entry point for the react application.
 */
createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={darkTheme}>
        <App />
    </ThemeProvider>
)
