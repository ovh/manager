import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';

export type BreadcrumbItem = {
  id: string;
  label: string;
  navigateTo?: string;
};

type UseBreadcrumbParams = {
  items: BreadcrumbItem[];
};

export const useBreadcrumb = ({
  items,
}: UseBreadcrumbParams): BreadcrumbItem[] => {
  const { t } = useTranslation('key-management-service/listing');

  const location = useLocation();

  // Split the url path and remove the first element ('key-management-service')
  const pathnames = location.pathname
    .split('/')
    .filter((x) => x)
    .slice(1);

  const rootItem: BreadcrumbItem = {
    id: 'root',
    label: t('key_management_service_listing_title'),
    navigateTo: KMS_ROUTES_URLS.kmsListing,
  };

  const pathItems: BreadcrumbItem[] = pathnames.map((pathname) => {
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
