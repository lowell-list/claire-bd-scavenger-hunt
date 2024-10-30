import React, { StrictMode } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Theme, ThemePanel } from '@radix-ui/themes';
import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOMClient.createRoot(rootElement);

root.render(
  <StrictMode>
    <Theme accentColor='grass' grayColor='sand' radius='large' scaling='95%'>
      <App />
      <ThemePanel defaultOpen={false}/>
    </Theme>
  </StrictMode>
);
