import { useContext, useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { BreadcrumbItem, BreadcrumbType } from './Breadcrumb.type';

export const useBreadcrumb = ({ rootLabel, appName, hideRootLabel = false }: BreadcrumbType) => {
  const { shell } = useContext(ShellContext);
  const [root, setRoot] = useState<BreadcrumbItem[]>([]);
  const [paths, setPaths] = useState<BreadcrumbItem[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchRoot = async () => {
      try {
        const response = await shell?.navigation.getURL(appName, '#/', {});
        const rootItem = {
          label: rootLabel,
          href: String(response),
          hideLabel: hideRootLabel,
        };
        setRoot([rootItem]);
      } catch {
        // Fetch navigation error
      }
    };
    fetchRoot();
  }, [rootLabel, appName, shell?.navigation]);

  useEffect(() => {
    const pathnames = location?.pathname.split('/').filter((x) => x);
    const pathsTab = pathnames?.map((value, index) => {
      const parentPaths = pathnames.slice(0, index + 1);
      return {
        label: value,
        href: `#/${parentPaths.join('/')}`,
        hideLabel: false,
      };
    });
    setPaths(pathsTab);
  }, [location.pathname]);

  return [...root, ...paths];
};
