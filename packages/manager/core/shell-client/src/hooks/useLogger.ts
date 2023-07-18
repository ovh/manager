import { useShell } from './useShell';

export const useLogger = () => {
  const shell = useShell();

  return shell.logger;
};

export default useLogger;
