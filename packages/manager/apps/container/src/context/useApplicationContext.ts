import { useContext } from 'react';

import { Shell } from '@ovh-ux/shell';

import ApplicationContext, {
  ApplicationContextType,
} from './application.context';

export const useApplication = (): ApplicationContextType => {
  const applicationContext = useContext(ApplicationContext);
  if (!applicationContext) {
    throw new Error('useApplication must be used within a ApplicationProvider');
  }

  return applicationContext;
};

export const useShell = (): Shell => useApplication().shell;

export default {
  useApplication,
  useShell,
};
