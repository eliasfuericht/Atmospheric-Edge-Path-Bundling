import { scan } from 'react-scan'; // import this BEFORE react
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

if (typeof window !== 'undefined') {
    scan({
        enabled: false,
        log: true, // prints re-renders to the console
        showToolbar: true,

    });
}
createRoot(document.getElementById('root')!).render(
    <App />
)
