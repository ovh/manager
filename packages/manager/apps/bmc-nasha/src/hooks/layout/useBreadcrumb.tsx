import { useContext, useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import type { BreadcrumbItem } from '@/types/Breadcrumb.type';

type UseBreadcrumbProps = {
  rootLabel: string;
  appName: string;
  items?: BreadcrumbItem[];
};

export const useBreadcrumb = ({
  rootLabel,
  appName,
  items,
}: UseBreadcrumbProps): BreadcrumbItem[] => {
  const { shell } = useContext(ShellContext);
  const [rootItems, setRootItems] = useState<BreadcrumbItem[]>([]);
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  useEffect(() => {
    const fetchRoot = async () => {
      try {
        const response = await shell?.navigation.getURL(appName, '#/', {});
        const rootItem: BreadcrumbItem = {
          label: rootLabel,
          href: typeof response === 'string' ? response : response?.href || '#/',
        };
        setRootItems([rootItem]);
      } catch {
        // Fetch navigation error - set empty root
        setRootItems([]);
      }
    };
    void fetchRoot();
  }, [rootLabel, appName, shell?.navigation]);

  const pathItems: BreadcrumbItem[] = pathnames.map((value, index) => {
    const item = items?.find((item) => item.href.includes(value));
    const parentPaths = pathnames.slice(0, index + 1);
    return {
      label: item?.label || value,
      href: item?.href || `#/${appName}/${parentPaths.join('/')}`,
    };
  });

  return [...rootItems, ...pathItems];
};



