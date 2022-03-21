import { useContext } from 'react';
import ApplicationContext from './application.context';

export const useApplication = () => {
  return useContext(ApplicationContext);
};

export const useEnvironment = () => {
  const { environment } = useContext(ApplicationContext);
  return environment;
};

export const useUser = () => {
  const { environment } = useContext(ApplicationContext);
  return environment.getUser();
};

export const useShell = () => {
  const { shell } = useContext(ApplicationContext);
  return shell;
};
