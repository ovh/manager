import { useContext } from 'react';

import { Shell } from '@ovh-ux/shell';

import ApplicationContext, {
  ApplicationContextType,
} from './application.context';

/**
 * @deprecated use context from useContainer instead
 */
export const useApplication = (): ApplicationContextType => {
  const applicationContext = useContext(ApplicationContext);
  if (!applicationContext) {
    throw new Error('useApplication must be used within a ApplicationProvider');
  }

  return applicationContext;
};

/**
 * @deprecated use shell object from useContainer instead
 */
export const useShell = (): Shell => {
  const { shell } = useContext(ApplicationContext);
  return shell;
};

export default {
  useApplication,
  useShell,
};
