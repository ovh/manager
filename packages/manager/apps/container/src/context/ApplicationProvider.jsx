import React from 'react';

import ApplicationContext from './application.context';
import { HeaderProvider } from './header';

export const ApplicationProvider = ({ children, environment, shell }) => {
  return (
    <ApplicationContext.Provider
      value={{ environment, shell }}
    >
      <HeaderProvider>{children}</HeaderProvider>
    </ApplicationContext.Provider>
  );
};

export default ApplicationProvider;
