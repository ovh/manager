import { useShell } from "./useShell";

export const useAuth = () => {
  const shell = useShell();

  return shell.auth;
}


export default useAuth;
