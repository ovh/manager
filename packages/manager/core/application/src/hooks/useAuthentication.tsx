import { useEnvironment as useEnv, useShell } from '..';

export function useAuthentication() {
  const env = useEnv();
  const shell = useShell();
  const user = env?.getUser();

  return {
    login() {
      return shell?.auth.login();
    },
    logout() {
      return shell?.auth.logout();
    },
    get nichandle(): string | undefined {
      return user?.nichandle;
    },
    get subsidiary(): string | undefined {
      return user?.ovhSubsidiary;
    },
    roles(): string[] {
      return user?.auth?.roles || [];
    },
    isTrusted(): boolean | undefined {
      return user?.isTrusted;
    },
  };
}

export default useAuthentication;
