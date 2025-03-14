import { useContext } from 'react';

import { Shell } from '@ovh-ux/shell';

import ApplicationContext, {
  ApplicationContextType,
} from './application.context';

/**
 * @deprecated use context from useContainer instead
 */
export const useApplication = (): ApplicationContextType => {
  return useContext(ApplicationContext);
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
