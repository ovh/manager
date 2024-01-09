import React from 'react';

import { Environment, User } from '@ovh-ux/manager-config';
import { Shell } from '@ovh-ux/shell';
import ApplicationContext from './application.context';

const defaultUser: Partial<User> = {
  firstname: 'Tester',
  name: 'testee',
  supportLevel: {
    level: '1',
  },
  country: 'FR',
};
const universe = 'web';

const defaultEnvironment: Partial<Environment> = {
  getUser: () => defaultUser as User,
  getUniverse: () => universe,
  getUserLocale: () => 'fr_FR',
};

export type ApplicationProviderProps = React.PropsWithChildren<{
  environment: Environment;
  shell: Shell;
}>;

export const ApplicationProvider: React.FC<ApplicationProviderProps> = ({
  environment = defaultEnvironment as Environment,
  shell = {} as Shell,
  children,
}) => {
  const applicationContext = { environment, shell };

  return (
    <ApplicationContext.Provider value={applicationContext}>
      {children}
    </ApplicationContext.Provider>
  );
};
