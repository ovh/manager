import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { SubApp } from '@/identity-access-management.config';

export type BreadcrumbItem = {
  label: string | undefined;
  hideLabel?: boolean;
  navigate?: string;
};

export interface UseBreadcrumbProps {
  rootLabel?: string;
  appName?: string;
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
        const rootItem = {
          label: rootLabel,
          hideLabel: hideRootLabel,
          navigate: '/',
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
      const navigate = `/${parentPaths.join('/')}`;
      return {
        label: value,
        hideLabel: false,
        navigate,
      };
    });
    setPaths(pathsTab);
  }, [location.pathname]);

  return [...root, ...paths];
};
