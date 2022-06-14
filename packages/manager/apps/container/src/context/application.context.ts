import { createContext } from 'react';

import { Environment } from '@ovh-ux/manager-config';
import { Shell } from '@ovh-ux/shell/types';

export type ApplicationContextType = {
  environment: Environment;
  shell: Shell;
};

const ApplicationContext = createContext<ApplicationContextType>(
  {} as ApplicationContextType,
);

export default ApplicationContext;
