import { useContext, useEffect, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const useVrackUrl = (vRack: string) => {
  const { navigation } = useContext(ShellContext).shell;

  const [url, setUrl] = useState('');

  useEffect(() => {
    if (vRack) {
      navigation
        .getURL('dedicated', `#/vrack/${vRack}`, {})
        .then((data: string) => {
          setUrl(data);
        });
    }
  }, [navigation, vRack]);

  return url;
};