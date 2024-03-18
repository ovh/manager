import { useShell } from './useShell';

export const useNavigation = () => {
  const shell = useShell();
  return shell.navigation;
};

export default useNavigation;
