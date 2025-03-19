import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useState, useEffect } from 'react';

export const useHostingUrl = (service: string, path = '') => {
  const { shell } = useContext(ShellContext);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrl = async () => {
      const fetchedUrl = (await shell.navigation?.getURL(
        'web',
        `/hosting/${service}/${path}`,
        {},
      )) as string;
      setUrl(fetchedUrl);
    };
    fetchUrl();
  }, [shell, service, path]);

  return url;
};
