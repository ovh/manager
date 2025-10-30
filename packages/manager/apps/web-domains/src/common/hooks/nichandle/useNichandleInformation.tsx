import { User } from '@ovh-ux/manager-config/dist/types/environment/user';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect, useState } from 'react';

export const useNichandleInformation = () => {
  const { shell } = useContext(ShellContext);
  const { environment } = shell;
  const [nichandleInformation, setNichandleInformation] = useState<User>();

  useEffect(() => {
    const getNichandleInformation = async () => {
      const env = await environment.getEnvironment();
      const user = env.getUser();
      setNichandleInformation(user);
    };
    getNichandleInformation();
  }, []);

  return { nichandleInformation };
};
