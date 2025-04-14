import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useProject } from '@ovh-ux/manager-pci-common';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
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
export const usePciBreadcrumb = ({
  projectId,
  appName,
}: BreadcrumbProps) => {
  const { shell } = useContext(ShellContext);
  const [root, setRoot] = useState<BreadcrumbItem[]>([]);
  const [appRoot, setAppRoot] = useState<BreadcrumbItem[]>([]);
  const { data: project } = useProject(projectId);
  const hrefProject = useProjectUrl('public-cloud');

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
          href: hrefProject,
        };
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

