import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import ReactDOM from 'react-dom/client';
import { Provider as ReduxProvider } from 'react-redux';
import App from './App';
import { Constants } from './Constants';
import './index.css';
import { store } from './redux/app/store';

import React from 'react';

if (!localStorage.getItem('debug')) {
    localStorage.setItem('debug', `${Constants.debug.root}:*`);
}

let container: HTMLElement | null = null;
document.addEventListener('DOMContentLoaded', () => {
    if (!container) {
        container = document.getElementById('root');
        if (!container) {
            throw new Error('Could not find root element');
        }
        const root = ReactDOM.createRoot(container);
        root.render(
            <React.StrictMode>
                <ReduxProvider store={store}>
                    <FluentProvider className="app-container" theme={webLightTheme}>
                        <App />
                    </FluentProvider>
                </ReduxProvider>
            </React.StrictMode>,
        );
    }
});
