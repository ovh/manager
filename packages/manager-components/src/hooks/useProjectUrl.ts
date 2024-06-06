import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const useProjectUrl = (appName: string) => {
  const { projectId } = useParams();
  const { navigation } = useContext(ShellContext).shell;

  const [url, setUrl] = useState('public-cloud');

  useEffect(() => {
    navigation
      .getURL(appName, `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setUrl(data as string);
      });
  }, [projectId, navigation, appName]);

  return url;
};
