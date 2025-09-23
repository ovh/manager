import { useContext, useState, useEffect } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const useDedicatedUrl = () => {
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const [dedicatedUrl, setDedicatedUrl] = useState('');

  useEffect(() => {
    navigation
      .getURL('dedicated', '#/configuration/ip', {})
      .then((data) => setDedicatedUrl(data as string));
  }, [navigation]);

  return dedicatedUrl;
};
