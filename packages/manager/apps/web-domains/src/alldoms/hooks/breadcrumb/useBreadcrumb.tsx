import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export type BreadcrumbItem = {
  label: string | undefined;
  href?: string;
};

export interface UseBreadcrumbProps {
  rootLabel?: string;
  appName?: string;
  projectId?: string;
  ignoredLabel?: string[];
}
export const useBreadcrumb = ({
  rootLabel,
  appName,
  ignoredLabel = [],
}: UseBreadcrumbProps) => {
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
    fetchRoot();
  }, [rootLabel, appName, shell?.navigation]);

  useEffect(() => {
    const pathnames = location?.pathname.split('/').filter((x) => x);
    const pathsTab = pathnames
      ?.map((value) => ({
        label: value,
        href: `/#/${appName}/${value}`,
      }))
      .filter((pathTab) => !ignoredLabel.includes(pathTab.label));
    setPaths(pathsTab);
  }, [location.pathname]);

  return [...root, ...paths];
};
