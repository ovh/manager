import { useContext } from 'react';

import { Shell } from '@ovh-ux/shell';

import ApplicationContext, {
  ApplicationContextType,
} from './application.context';

export const useApplication = (): ApplicationContextType => {
  return useContext(ApplicationContext);
};

export const useShell = (): Shell => {
  const { shell } = useContext(ApplicationContext);
  return shell;
};

export default {
  useApplication,
  useShell,
};
