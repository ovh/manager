import { useShell } from './useShell';

export const useUX = () => {
  const shell = useShell();
  return shell.ux;
};

export default useUX;
