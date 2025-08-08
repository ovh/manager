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
  subApp?: SubApp;
  hideRootLabel?: boolean;
}
export const useBreadcrumb = ({
  rootLabel,
  appName,
  hideRootLabel = false,
  subApp,
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
    const pathsTab = pathnames?.map((value) => {
      const navigate = subApp === value ? `/${value}` : `/${subApp}/${value}`;
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
