import { useContext, useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { APP_FEATURES } from '@/App.constants';
import { BreadcrumbItem, BreadcrumbProps } from '@/types/Breadcrumb.type';

const APP_PARENT_ROUTE = APP_FEATURES.appSlug;
const removeRouteIgnored = (path: string) => APP_PARENT_ROUTE !== path;

export const useBreadcrumb = ({ rootLabel, appName }: BreadcrumbProps) => {
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
        };
        setRoot([rootItem]);
      } catch {
        // Fetch navigation error
      }
    };
    void fetchRoot();
  }, [rootLabel, appName, shell?.navigation]);

  useEffect(() => {
    const pathnames =
      location?.pathname
        .split('/')
        .filter((x) => x)
        .filter(removeRouteIgnored) ?? [];
    const pathsTab = pathnames?.map((value, index) => {
      const parentPaths = pathnames.slice(0, index + 1);
      return {
        label: value,
        href: `#/${APP_PARENT_ROUTE}/${parentPaths.join('/')}`,
        hideLabel: false,
      };
    });
    setPaths(pathsTab);
  }, [location.pathname]);

  return [...root, ...paths];
};
