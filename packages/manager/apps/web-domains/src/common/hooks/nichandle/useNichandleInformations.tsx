import { User } from '@ovh-ux/manager-config/dist/types/environment/user';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect, useState } from 'react';

export const useNichandleInformations = () => {
  const { shell } = useContext(ShellContext);
  const { environment } = shell;
  const [nichandleInformations, setNichandleInformations] = useState<User>();

  useEffect(() => {
    const getNichandleInformations = async () => {
      const env = await environment.getEnvironment();
      const user = env.getUser();
      setNichandleInformations(user);
    };
    getNichandleInformations();
  }, []);

  return { nichandleInformations };
};
