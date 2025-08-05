/**
 * @deprecated This file is deprecated. Do not use any of its exports.
 * @deprecated file will be removed in MRC v3, all code will be move in @ovh-ux/manager-module-common-api'
 */
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

/**
 * @deprecated This hook is deprecated and will be removed in MRC V3.
 */
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
