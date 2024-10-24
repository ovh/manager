import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { urls } from '@/routes/routes.constant';

export type BreadcrumbItem = {
  id: string;
  label: string | undefined;
  onClick?: (event?: BreadcrumbEvent) => void;
};

type BreadcrumbEvent = Event & {
  target: { isCollapsed?: boolean; isLast?: boolean };
};

export interface BreadcrumbProps {
  rootLabel?: string;
  items?: BreadcrumbItem[];
}

export const useBreadcrumb = ({ rootLabel, items }: BreadcrumbProps) => {
  const [paths, setPaths] = useState<BreadcrumbItem[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const root: BreadcrumbItem = {
    id: rootLabel,
    label: rootLabel,
    onClick: () => navigate(urls.root),
  };

  useEffect(() => {
    const pathsTab = pathnames.map((value, index) => {
      const item = items?.find(({ id }) => id === value);

      return {
        id: item?.id ?? value,
        label: item?.label ?? value,
        onClick: (event: BreadcrumbEvent) => {
          const { isCollapsed, isLast } = event.target;
          if (!isCollapsed && !isLast) {
            navigate(`/${pathnames.slice(0, index + 1).join('/')}`);
          }
        },
      };
    });
    setPaths(pathsTab);
  }, [location, items]);

  return [root, ...paths];
};
