import { useContext, useEffect, useState } from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const useEmailsUrl = (service: string, path = '') => {
  const { shell } = useContext(ShellContext);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrl = async () => {
      const fetchedUrl = (await shell.navigation?.getURL(
        'web',
        `/email_domain/${service}/${path}`,
        {},
      )) as string;
      setUrl(fetchedUrl);
    };
    fetchUrl().catch(console.error);
  }, [shell, service, path]);

  return url;
};
