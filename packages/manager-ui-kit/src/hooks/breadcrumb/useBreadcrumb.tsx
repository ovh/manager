import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export type BreadcrumbItem = {
  label: string | undefined;
  href?: string;
  hideLabel?: boolean;
};

export interface UseBreadcrumbProps {
  rootLabel?: string;
  appName?: string;
  projectId?: string;
  hideRootLabel?: boolean;
}
export const useBreadcrumb = ({
  rootLabel,
  appName,
  hideRootLabel = false,
}: UseBreadcrumbProps) => {
  const { shell } = useContext(ShellContext);
  const [root, setRoot] = useState<BreadcrumbItem[]>([]);
  const [paths, setPaths] = useState<BreadcrumbItem[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchRoot = async () => {
      try {
        const response = await shell?.navigation.getURL(
          appName as string,
          '#/',
          {},
        );
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
