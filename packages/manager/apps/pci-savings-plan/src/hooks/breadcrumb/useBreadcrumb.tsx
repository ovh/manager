import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useProject } from '@ovh-ux/manager-pci-common';

export type BreadcrumbItem = {
  label: string | undefined;
  href?: string;
};

export interface BreadcrumbProps {
  rootLabel?: string;
  appName?: string;
  projectId?: string;
  items?: BreadcrumbItem[];
}
export const usePciBreadcrumb = ({ projectId, appName }: BreadcrumbProps) => {
  const { shell } = useContext(ShellContext);
  const [root, setRoot] = useState<BreadcrumbItem[]>([]);
  const [appRoot, setAppRoot] = useState<BreadcrumbItem[]>([]);
  const { data: project } = useProject();

  useEffect(() => {
    const { description } = project;
    const fetchRoot = async () => {
      try {
        const response = (await shell?.navigation.getURL(
          'public-cloud',
          `#/pci/projects/${projectId}`,
          {},
        )) as string;
        const rootItem = {
          label: description,
          href: response as string,
        };
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const appRoot = {
          label: appName,
          href: response.split('public-cloud')[1],
        };
        setRoot([rootItem]);
        setAppRoot([appRoot]);
      } catch (error) {
        console.error('Error fetching root URL:', error);
      }
    };
    if (project) fetchRoot();
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
    const pathsTab = pathnames.map((value) => ({
      label: value,
      href: `/#/${appName}/${value}`,
    }));
    setPaths(pathsTab);
  }, [location]);

  return [...root, ...paths];
};
