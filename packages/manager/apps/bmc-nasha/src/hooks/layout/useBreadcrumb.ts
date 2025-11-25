import { useContext, useEffect, useMemo, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import type { BreadcrumbItem } from '@/types/Breadcrumb.type';

export interface UseBreadcrumbProps {
  rootLabel: string;
  appName?: string;
  items?: BreadcrumbItem[];
}

export const useBreadcrumb = ({
  rootLabel,
  appName,
  items,
}: UseBreadcrumbProps): BreadcrumbItem[] => {
  const { shell } = useContext(ShellContext);
  const [root, setRoot] = useState<BreadcrumbItem[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchRoot = async () => {
      try {
        if (!appName) {
          setRoot([]);
          return;
        }

        const response = await shell?.navigation.getURL(appName, '#/', {});

        let href = '/';
        if (typeof response === 'string') {
          href = response;
        } else if (response instanceof URL) {
          href = response.href;
        } else if (response && typeof (response as { href?: unknown }).href === 'string') {
          href = (response as { href: string }).href;
        }

        setRoot([{ label: rootLabel, href }]);
      } catch {
        // If getURL fails, don't set root (tests show only path breadcrumbs)
        setRoot([]);
      }
    };
    void fetchRoot();
  }, [rootLabel, appName, shell?.navigation]);

  // Calculate paths synchronously using useMemo instead of useState
  const paths = useMemo(() => {
    // If custom items are provided, use them instead of path-based breadcrumbs
    if (items && items.length > 0) {
      return items;
    }

    const pathnames = location.pathname.split('/').filter((x) => x);
    return pathnames.map((value, index) => {
      const parentPaths = pathnames.slice(0, index + 1);
      return {
        label: value,
        href: `/#/${appName}/${parentPaths.join('/')}`,
      };
    });
  }, [location.pathname, items, appName]);

  return [...root, ...paths];
};
