import { useShell } from './useShell';

export const useTracking = () => {
  const shell = useShell();
  return shell.tracking;
};

export default useTracking;
