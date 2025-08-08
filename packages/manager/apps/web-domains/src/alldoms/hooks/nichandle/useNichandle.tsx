import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect, useState } from 'react';

export const useNichandle = () => {
  const { shell } = useContext(ShellContext);
  const { environment } = shell;
  const [nichandle, setNichandle] = useState('');

  useEffect(() => {
    const getNichandle = async () => {
      const env = await environment.getEnvironment();
      const user = env.getUser();
      setNichandle(user.nichandle);
    };
    getNichandle();
  }, []);

  return { nichandle };
};
