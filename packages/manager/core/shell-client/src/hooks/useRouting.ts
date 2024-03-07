import { useShell } from './useShell';

export const useRouting = () => {
  const shell = useShell();
  return shell.routing;
};

export default useRouting;
