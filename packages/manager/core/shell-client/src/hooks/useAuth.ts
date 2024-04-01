import { useShell } from './useShell';

/**
 * @deprecated use ShellContext directly
 */
export const useAuth = () => {
  const shell = useShell();
  return shell.auth;
};

export default useAuth;
