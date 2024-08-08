import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { urls } from '@/routes/routes.constant';

export type BreadcrumbItem = {
  id: string;
  label: string | undefined;
  href?: string;
  onClick?: () => void;
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
  const [paths, setPaths] = useState<BreadcrumbItem[]>([]);
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const navigate = useNavigate();

  const rootItem = {
    id: rootLabel,
    label: rootLabel,
    onClick: () => navigate(urls.root),
  };

  useEffect(() => {
    const pathsTab = pathnames.map(
      (value) =>
        items?.find(({ id }) => id === value) ?? {
          id: value,
          label: value,
          href: `/#/${appName}/${value}`,
        },
    );
    setPaths(pathsTab);
  }, [location, items]);

  return [rootItem, ...paths];
};
