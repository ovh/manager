import { useShell } from './useShell';

/**
 * @deprecated use ShellContext directly
 */
export const useLogger = () => {
  const shell = useShell();
  return shell.logger;
};

export default useLogger;
