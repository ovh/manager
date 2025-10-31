import { User } from '@ovh-ux/manager-config';
import { useShell } from '@ovh-ux/manager-react-shell-client';
import { useEffect, useState } from 'react';

/**
 * Fetches the current user
 * @returns The current user
 */
export function useUser() {
  const shellCtx = useShell();
  const [user, setUser] = useState<User>();
  // fetch initial user
  useEffect(() => {
    const fetchUser = async () => {
      const u = (await shellCtx.environment.getEnvironment()).getUser();
      setUser(u);
    };
    fetchUser();
  }, [shellCtx.environment]);
  return user;
}
