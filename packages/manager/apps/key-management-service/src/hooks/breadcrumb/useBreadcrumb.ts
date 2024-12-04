import { useEffect, useState } from 'react';
import { OdsBreadcrumbItem as OdsBreadcrumbItemType } from '@ovhcloud/ods-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES_URLS } from '@/routes/routes.constants';

export type BreadcrumbItem = {
  id: string;
  label: string;
  navigateTo: string;
};

export interface BreadcrumbProps {
  rootLabel: string;
  items?: BreadcrumbItem[];
}

export const useBreadcrumb = ({ rootLabel, items }: BreadcrumbProps) => {
  const [pathItems, setPathItems] = useState<OdsBreadcrumbItemType[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const rootItem = ({
    label: rootLabel,
    onOdsClick: () => navigate(ROUTES_URLS.root),
  } as unknown) as OdsBreadcrumbItemType;

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

    setPathItems(pathNamesItems as OdsBreadcrumbItemType[]);
  }, [location, items]);

  return [rootItem, ...pathItems];
};
