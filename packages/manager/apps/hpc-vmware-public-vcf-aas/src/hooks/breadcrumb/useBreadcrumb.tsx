import { useHref, useLocation } from 'react-router-dom';

import { JSX } from '@ovhcloud/ods-components';

import { urls } from '@/routes/routes.constant';

import { useApplicationBreadcrumbItems } from './useApplicationBreadcrumbItems';

export type BreadcrumbItem = {
  id: string;
  label: string | undefined;
  href?: string;
};

export interface BreadcrumbProps {
  rootLabel?: string;
}

export const useBreadcrumb = ({ rootLabel }: BreadcrumbProps) => {
  const location = useLocation();
  const rootHref = useHref(`${urls.root}/`);
  const { items } = useApplicationBreadcrumbItems();

  const isRootPath = (path: string) => path === urls.root.replace('/', '');

  const rootItem = {
    id: rootLabel,
    label: rootLabel,
    href: rootHref,
  };

  const pathnames = location.pathname
    .split('/')
    .filter((path) => !isRootPath(path) && Boolean(path));
  const pathsTab = pathnames.map((value, index) => {
    const item = items?.find(({ id }) => id === value);

    return {
      id: item?.id ?? value,
      label: item?.label ?? value,
      pathnames,
      href: `${rootHref}${pathnames.slice(0, index + 1).join('/')}`,
    };
  });

  return [rootItem, ...pathsTab] as JSX.OdsBreadcrumbItem[];
};
