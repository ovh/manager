import { useShell } from '..';

export function useLogger() {
  const shell = useShell();
  return shell?.logger;
}

export default useLogger;
