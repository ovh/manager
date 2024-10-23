import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export type BreadcrumbItem = {
  id: string;
  label: string | undefined;
  href?: string;
};

export interface BreadcrumbProps {
  rootLabel?: string;
  appName?: string;
  projectId?: string;
  items?: BreadcrumbItem[];
}

export const useBreadcrumb = ({
  rootLabel,
  appName,
  items,
}: BreadcrumbProps) => {
  const { shell } = useContext(ShellContext);
  const [root, setRoot] = useState<BreadcrumbItem>();
  const [paths, setPaths] = useState<BreadcrumbItem[]>([]);
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  useEffect(() => {
    const fetchRoot = async () => {
      try {
        const response = await shell?.navigation.getURL(appName, '#/', {});
        const rootItem = {
          label: rootLabel,
          href: String(response),
        };
        setRoot(rootItem);
      } catch {
        // Fetch navigation error
      }
    };
    fetchRoot();
  }, [rootLabel, appName, shell?.navigation]);

  useEffect(() => {
    const pathsTab = pathnames.map((value) => {
      const item = items?.find(({ id }) => id === value);

      return {
        label: item ? item.label : value,
        href: `/#/${appName}/${value}`,
      };
    });
    setPaths(pathsTab);
  }, [location, items]);

  return [root, ...paths];
};
