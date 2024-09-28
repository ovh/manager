import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { ManagerReactComponentContext } from '../context/ManagerReactComponentsContext';

export const useProjectUrl = (appName: string) => {
  const { projectId } = useParams();
  const context = useContext(ManagerReactComponentContext);
  const { shellContext } = context;
  const { navigation } = useContext(shellContext).shell;

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
