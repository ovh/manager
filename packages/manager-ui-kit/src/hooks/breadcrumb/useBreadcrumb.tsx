import { useContext, useEffect, useMemo, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { BreadcrumbItem, BreadcrumbType } from './Breadcrumb.type';

export const useBreadcrumb = ({ rootLabel, appName, hideRootLabel = false }: BreadcrumbType) => {
  const { shell } = useContext(ShellContext);
  const [root, setRoot] = useState<BreadcrumbItem[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchRoot = async () => {
      try {
        if (!appName) return;

        const response = await shell?.navigation.getURL(appName, '#/', {});

        let href = '';
        if (typeof response === 'string') {
          href = response;
        } else if (response instanceof URL) {
          href = response.href;
        } else if (response && typeof (response as { href?: unknown }).href === 'string') {
          href = (response as { href: string }).href;
        }

        const rootItem = {
          label: rootLabel,
          href,
          hideLabel: hideRootLabel,
        };

        setRoot([rootItem]);
      } catch {
        // Fetch navigation error
      }
    };
    void fetchRoot();
  }, [rootLabel, appName, shell?.navigation, hideRootLabel]);

  const paths = useMemo(() => {
    const pathnames = location?.pathname.split('/').filter((x) => x);
    return pathnames?.map((value, index) => {
      const parentPaths = pathnames.slice(0, index + 1);
      return {
        label: value,
        href: `#/${parentPaths.join('/')}`,
        hideLabel: false,
      };
    });
  }, [location?.pathname]);

  return [...root, ...paths];
};
