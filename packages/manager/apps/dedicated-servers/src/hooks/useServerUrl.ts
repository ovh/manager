import { useContext, useEffect, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { DedicatedServer } from '@/data/types/server.type';

export const useServerUrl = (server: DedicatedServer) => {
  const { navigation } = useContext(ShellContext).shell;

  const [url, setUrl] = useState('');

  useEffect(() => {
    if (server) {
      navigation
        .getURL('dedicated', `#/server/${server.name}`, {})
        .then((data) => {
          setUrl(data as string);
        });
    }
  }, [navigation, server]);

  return url;
};
