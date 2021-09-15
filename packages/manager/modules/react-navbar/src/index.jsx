import React from 'react';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import Navbar from './navbar.jsx';
import { Provider as EnvironmentProvider } from './environment';
import fallbackTranslations from './translations/navbar_fr_FR.json';

export const ReactNavbar = (props) => {
  const { environment } = props;

  return (
    <React.StrictMode>
      <EnvironmentProvider value={environment}>
        <Navbar
          universe={environment.getUniverse()}
          user={environment.getUser()}
        />
      </EnvironmentProvider>
    </React.StrictMode>
  );
};

export default ReactNavbar;
