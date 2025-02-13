import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect, useState } from 'react';

export const UseManagerUrl = (path: string, value: string) => {
  const nav = useContext(ShellContext).shell.navigation;
  const [url, setUrl] = useState('');

  useEffect(() => {
    nav
      .getURL('manager', `#/web/${path}/${value}/information`, {})
      .then((data) => {
        setUrl(data as string);
      });
  }, [path, value]);
  return url;
};
