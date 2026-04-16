import React from 'react';
import { createRoot } from 'react-dom/client';
import '@bamboohr/fabric/dist/minimal-styles.css';
import { BaseStyles, ThemeProvider } from '@bamboohr/fabric';
import App from './App';
import './index.css';

document.body.setAttribute('data-fabric-theme', 'encore');

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ThemeProvider themeName="encore">
      <BaseStyles>
        <App />
      </BaseStyles>
    </ThemeProvider>
  </React.StrictMode>
);
