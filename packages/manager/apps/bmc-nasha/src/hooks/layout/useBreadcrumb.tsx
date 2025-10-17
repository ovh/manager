import { useContext, useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { useProject } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { BreadcrumbItem, BreadcrumbProps } from '@/types/Breadcrumb.type';

export const usePciBreadcrumb = ({ projectId, appName }: BreadcrumbProps) => {
  const { shell } = useContext(ShellContext);
  const [root, setRoot] = useState<BreadcrumbItem[]>([]);
  const [appRoot, setAppRoot] = useState<BreadcrumbItem[]>([]);
  const { data: project } = useProject(projectId);
  const { addError } = useNotifications();

  useEffect(() => {
    const fetchRoot = async () => {
      try {
        const response = (await shell?.navigation.getURL(
          'public-cloud',
          `#/pci/projects/${projectId}`,
          {},
        )) as string;
        const rootItem = {
          label: project?.description,
          href: response,
        };
        const appRootItem = {
          label: appName || '',
          href: response.split('public-cloud')[1] || '',
        };
        setRoot([rootItem]);
        setAppRoot([appRootItem]);
      } catch (error) {
        addError('Failed to load navigation data');
      }
    };
    if (project) {
      fetchRoot();
    }
  }, [project]);

  return [...root, ...appRoot];
};

export const useBreadcrumb = ({ rootLabel, appName }: BreadcrumbProps) => {
  const { shell } = useContext(ShellContext);
  const [root, setRoot] = useState<BreadcrumbItem[]>([]);
  const [paths, setPaths] = useState<BreadcrumbItem[]>([]);
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  useEffect(() => {
    const fetchRoot = async () => {
      try {
        const response = await shell?.navigation.getURL(appName as string, '#/', {});
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
    const pathsTab = pathnames.map((value) => ({
      label: value,
      href: `/#/${appName}/${value}`,
    }));
    setPaths(pathsTab);
  }, [location]);

  return [...root, ...paths];
};
