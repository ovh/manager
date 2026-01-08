import { useLocation } from 'react-router-dom';

import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { useTranslation } from 'react-i18next';

export type KmsBreadcrumbItem = {
  id: string;
  label: string;
  navigateTo?: string;
};

type UseBreadcrumbParams = {
  items: KmsBreadcrumbItem[];
};

export const useBreadcrumb = ({ items }: UseBreadcrumbParams): KmsBreadcrumbItem[] => {
  const { t } = useTranslation('key-management-service/listing');

  const location = useLocation();

  // Split the url path and remove the first element ('key-management-service')
  const pathnames = location.pathname
    .split('/')
    .filter((x) => x)
    .slice(1);

  const rootItem: KmsBreadcrumbItem = {
    id: 'root',
    label: t('key_management_service_listing_title'),
    navigateTo: KMS_ROUTES_URLS.kmsListing,
  };

  const pathItems: KmsBreadcrumbItem[] = pathnames.map((pathname) => {
    // Search all pathnames in the items
    const itemFound = items?.find(({ id }) => id === pathname);

    if (!itemFound) {
      return {
        id: pathname,
        label: pathname,
      };
    }

    return {
      id: itemFound.id,
      label: itemFound.label,
      navigateTo: itemFound.navigateTo,
    };
  });

  return [rootItem, ...pathItems];
};
