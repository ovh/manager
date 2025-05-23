import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

interface UseUserInfos {
  isAdmin: boolean;
}

const USER_ADMIN_ROLE = 'ADMIN';

const useUserInfos = (): UseUserInfos => {
  const shellContext = useContext(ShellContext);
  const user = shellContext.environment.getUser();

  const role = Array.isArray(user?.auth?.roles) ? user?.auth?.roles[0] : '';

  const isAdmin = role === USER_ADMIN_ROLE;

  return { isAdmin };
};

export default useUserInfos;
