import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useQuery } from '@tanstack/react-query';

export const useIsUserTrusted = () => {
  const { shell } = useContext(ShellContext);
  const { environment } = shell;

  return useQuery({
    queryKey: ['user-trusted-status'],
    queryFn: async () => {
      const env = await environment.getEnvironment();
      const { isTrusted } = env.getUser();
      return isTrusted;
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};
