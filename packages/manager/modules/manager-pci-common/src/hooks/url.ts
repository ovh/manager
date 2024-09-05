import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const usePciUrl = () => {
  const { projectId } = useParams();

  const nav = useContext(ShellContext).shell.navigation;
  const [url, setUrl] = useState('');

  useEffect(() => {
    nav
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setUrl(data as string);
      });
  }, [projectId]);

  return url;
};
