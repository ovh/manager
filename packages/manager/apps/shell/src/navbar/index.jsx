import React from 'react';
import { withTranslation } from 'react-i18next';

import Navbar from './navbar.jsx';
import { Provider as EnvironmentProvider } from './environment';
import { TRANSLATE_NAMESPACE } from './constants';

const ReactNavbar = withTranslation(TRANSLATE_NAMESPACE)((props) => {
  const { t, environment } = props;

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
});

export default ReactNavbar;
