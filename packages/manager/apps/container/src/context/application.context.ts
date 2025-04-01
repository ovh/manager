import { createContext } from 'react';

import { Environment } from '@ovh-ux/manager-config';
import { Shell } from '@ovh-ux/shell';

export type ApplicationContextType = {
  environment: Environment;
  shell: Shell;
};

const ApplicationContext = createContext<ApplicationContextType | null>(null);

export default ApplicationContext;
