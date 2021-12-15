import { useContext } from 'react';
import ApplicationContext from './application.context';

export const useApplication = () => {
  return useContext(ApplicationContext);
};

export const useShell = () => {
  const { shell } = useContext(ApplicationContext);
  return shell;
};

export default {
  useApplication,
  useShell,
};
