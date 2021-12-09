import React, { useContext } from 'react';

import ApplicationContext from './application.context';

export const ApplicationProvider = ({ children, environment, shell }) => {
  let applicationContext = useContext(ApplicationContext);

  applicationContext = {
    environment,
    shell,
  };

  return (
    <ApplicationContext.Provider value={applicationContext}>
      {children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationProvider;
