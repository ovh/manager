import { useShell } from '@ovh-ux/manager-react-core-application';

export function useNavigation() {
  const shell = useShell();
  return shell.navigation;
}

export default useNavigation;
