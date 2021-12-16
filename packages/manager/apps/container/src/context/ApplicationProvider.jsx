import React, { useContext } from 'react';

import ApplicationContext from './application.context';
import { HeaderProvider } from './header';

export const ApplicationProvider = ({ children, environment, shell }) => {
  let applicationContext = useContext(ApplicationContext);

  applicationContext = {
    environment,
    shell,
  };

  return (
    <ApplicationContext.Provider value={applicationContext}>
      <HeaderProvider>{children}</HeaderProvider>
    </ApplicationContext.Provider>
  );
};

export default ApplicationProvider;
