import { useEffect, useState } from 'react';

import { useShell } from '@ovh-ux/manager-react-shell-client';

export const useGetUser = () => {
  const shell = useShell();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{ ovhSubsidiary?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!shell?.environment) {
        return;
      }

      try {
        const environment = await shell.environment.getEnvironment();
        const userData = environment.getUser();
        setUser(userData);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchUser();
  }, [shell?.environment]);

  return { user, isLoading };
};
