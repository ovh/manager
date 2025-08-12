import { useHref, useLocation } from 'react-router-dom';

import { urls } from '@/routes/Routes.constant';
import type { BreadcrumbProps } from '@/types/Breadcrumb.type';
import { formatToTitleCase } from '@/utils/String.utils';

export const useBreadcrumb = ({ rootLabel, items = [] }: BreadcrumbProps) => {
  const location = useLocation();
  const rootHref = useHref(urls.root).replace(/\/+$/, ''); // handle multiple trailing slashes

  const rootItem = { id: 'root', label: rootLabel, href: rootHref };

  const pathnames = location.pathname.split('/').filter(Boolean);

  const breadcrumbPathItems = pathnames.map((value, index) => {
    const matchedItem = items.find(({ id }) => id === value);
    return {
      id: matchedItem?.id ?? value,
      label: matchedItem?.label ?? formatToTitleCase(value), // possibly wrap in t()
      href: `${rootHref}/${pathnames.slice(0, index + 1).join('/')}`,
    };
  });

  return [rootItem, ...breadcrumbPathItems];
};
