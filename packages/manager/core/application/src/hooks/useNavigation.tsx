import { useShell } from '..';

export function useNavigation() {
  const shell = useShell();
  return shell?.navigation;
}

export default useNavigation;
