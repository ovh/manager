import React from 'react';
import ApplicationContext from './application.context';
import useContainer from '@/core/container';

type Props = {
  children: JSX.Element;
};

export const ApplicationProvider = ({
  children = null,
}: Props): JSX.Element => {
  const { shell, environment } = useContainer();

  const applicationContext = {
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
