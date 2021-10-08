import React, { useContext } from 'react';

import ApplicationContext from './application.context';
import useUx from '@/core/ux';

export const ApplicationProvider = ({ children, environment }) => {
  let applicationContext = useContext(ApplicationContext);
  const ux = useUx();

  applicationContext = {
    environment,
    ux,
  };

  return (
    <ApplicationContext.Provider value={applicationContext}>
      {children}
    </ApplicationContext.Provider>
  );
};

export default ApplicationProvider;
