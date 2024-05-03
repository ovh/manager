import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import initI18n from './i18n';

import './global.css';
import './index.scss';

// const token = ???;
// const user = decodeJWT(token);
const user = {
  legalform: 'individual',
  email: 'monsieur.madame@ovhcloud.com',
  language: 'fr_FR',
  subsidiary: 'FR',
};
const locale = user.language;

initI18n(locale, [locale], user.subsidiary);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
