import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsBreadcrumbItem as OdsBreadcrumbItemType } from '@ovhcloud/ods-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { KMS_ROUTES_URIS } from '@/routes/routes.constants';

export type BreadcrumbItem = {
  id: string;
  label: string;
  navigateTo: string;
};

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export interface KmsBreadcrumbItemType extends OdsBreadcrumbItemType {
  onOdsClick: () => void;
}

export const useBreadcrumb = ({ items }: BreadcrumbProps) => {
  const [pathItems, setPathItems] = useState<KmsBreadcrumbItemType[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('key-management-service/listing');
  const pathnames = location.pathname.split('/').filter((x) => x);

  const rootItem: BreadcrumbItem = {
    id: KMS_ROUTES_URIS.root,
    label: t(
      'key-management-service/listing:key_management_service_listing_title',
    ),
    navigateTo: `/${KMS_ROUTES_URIS.root}`,
  };

  items.push(rootItem);

  useEffect(() => {
    const pathNamesItems = pathnames.map((value) => {
      const item = items?.find(({ id }) => id === value);

      if (!item) {
        return {
          label: value,
        };
      }

      return {
        label: item.label,
        onOdsClick: () => navigate(item.navigateTo),
      };
    });

    setPathItems(pathNamesItems as KmsBreadcrumbItemType[]);
  }, [location, items]);

  return [...pathItems];
};
