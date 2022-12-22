import { useShell } from '@ovh-ux/manager-react-core-application';

export function useLogger() {
  const shell = useShell();
  return shell.logger;
}

export default useLogger;
