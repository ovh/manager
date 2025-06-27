import { useEffect, useState } from 'react';
import { OdsBreadcrumbItem as OdsBreadcrumbItemType } from '@ovhcloud/ods-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';

export type BreadcrumbItem = {
  id: string;
  label: string;
  navigateTo: string;
};

export interface BreadcrumbProps {
  rootLabel: string;
  items?: BreadcrumbItem[];
}

export interface KmsBreadcrumbItemType extends OdsBreadcrumbItemType {
  onOdsClick: () => void;
}

export const useBreadcrumb = ({ rootLabel, items }: BreadcrumbProps) => {
  const [pathItems, setPathItems] = useState<KmsBreadcrumbItemType[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const rootItem = ({
    label: rootLabel,
    onOdsClick: () => navigate(KMS_ROUTES_URLS.kmsListing),
  } as unknown) as KmsBreadcrumbItemType;

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

  return [rootItem, ...pathItems];
};
