import { useEffect, useState } from 'react';
import { OdsBreadcrumbAttributeItem } from '@ovhcloud/ods-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES_URLS } from '@/routes/routes.constants';

export type BreadcrumbItem = {
  id: string;
  label: string;
  navigateTo: string;
};

export type BreadcrumbAttributeItem = OdsBreadcrumbAttributeItem & {
  onClick?: () => void;
};

export interface BreadcrumbProps {
  rootLabel: string;
  items?: BreadcrumbItem[];
}

export const useBreadcrumb = ({ rootLabel, items }: BreadcrumbProps) => {
  const [pathItems, setPathItems] = useState<BreadcrumbAttributeItem[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const rootItem: BreadcrumbAttributeItem = {
    label: rootLabel,
    onClick: () => navigate(ROUTES_URLS.root),
  };

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
        onClick: () => navigate(item.navigateTo),
      };
    });

    setPathItems(pathNamesItems);
  }, [location, items]);

  return [rootItem, ...pathItems];
};
