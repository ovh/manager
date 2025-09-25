import { useLocation } from 'react-router-dom';

import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

import { APP_FEATURES, appName, productName } from '@/App.constants';
import { BreadcrumbItem, BreadcrumbProps } from '@/types/Breadcrumb.type';

const { appSlug, basePrefix } = APP_FEATURES;

export const useBreadcrumb = ({ items }: BreadcrumbProps = {}) => {
  const location = useLocation();
  const { data: url } = useNavigationGetUrl([appName, '#/', {}]);

  const pathnames = location.pathname
    .split('/')
    .filter(Boolean)
    .filter((path) => path !== appSlug);

  const rootItem: BreadcrumbItem = {
    id: appName,
    label: productName || appName,
    href: url as string,
  };

  const pathItems: BreadcrumbItem[] = pathnames.map((value) => ({
    id: value,
    label: value,
    href: `/#/${basePrefix}/${appSlug}/${value}`,
    // href: `${url}${value}`, // to try if navigation not working
  }));

  const breadcrumbItems: BreadcrumbItem[] = [rootItem, ...pathItems].map((crumb) => {
    const match = items?.find(({ id }) => id === crumb.id);

    return {
      id: match?.id ?? crumb.id,
      label: match?.label ?? crumb.label,
      href: match?.href ?? crumb.href,
      // href: crumb.href, // to try if navigation not working
    };
  });

  return breadcrumbItems;
};
