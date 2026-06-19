import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import {DuckDBProvider} from "@/components/DuckDBProvider.tsx";

createRoot(document.getElementById('root')!).render(
    <DuckDBProvider>
        <App/>
    </DuckDBProvider>
);
