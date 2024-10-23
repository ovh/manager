import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { urls } from '@/routes/routes.constant';

export type BreadcrumbItem = {
  id: string;
  label: string | undefined;
  onClick?: () => void;
};

export interface BreadcrumbProps {
  rootLabel?: string;
  appName?: string;
  projectId?: string;
  items?: BreadcrumbItem[];
}

export const useBreadcrumb = ({ rootLabel, items }: BreadcrumbProps) => {
  const [paths, setPaths] = useState<BreadcrumbItem[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const root: BreadcrumbItem = {
    label: rootLabel,
    onClick: () => navigate(urls.root),
  };

  useEffect(() => {
    const pathsTab = pathnames.map((value) => {
      const item = items?.find(({ id }) => id === value);

      return {
        label: item ? item.label : value,
        onClick: () => navigate(urls[item.id]),
      };
    });
    setPaths(pathsTab);
  }, [location, items]);

  return [root, ...paths];
};
