import {
  useEnvironment as useEnv,
  useShell,
} from '@ovh-ux/manager-react-core-application';

export function useAuthentication() {
  const env = useEnv();
  const shell = useShell();
  const user = env.getUser();

  return {
    login() {
      return shell.auth.login();
    },
    logout() {
      return shell.auth.logout();
    },
    get nichandle(): string {
      return user?.nichandle;
    },
    get subsidiary(): string {
      return user?.ovhSubsidiary;
    },
    roles(): string[] {
      return user?.auth?.roles || [];
    },
    isTrusted(): boolean {
      return user?.isTrusted;
    },
  };
}

export default useAuthentication;
