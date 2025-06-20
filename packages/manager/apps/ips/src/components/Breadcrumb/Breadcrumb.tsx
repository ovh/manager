import React from 'react';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { urls } from '@/routes/routes.constant';
import { APP_NAME } from '@/tracking.constant';

export type BreadcrumbItem = {
  label: string;
  href?: string;
  onClick?: () => void;
};

export type BreadcrumbProps = {
  mapper?: (item: BreadcrumbItem, index: number) => BreadcrumbItem;
};

export function Breadcrumb({
  mapper = (item) => item,
}: BreadcrumbProps): JSX.Element {
  const { t } = useTranslation('ips');
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split('/').filter(Boolean);
  const paths = pathnames
    .filter((value) => value !== 'ip')
    .map((value, index) =>
      mapper(
        {
          label: t(value),
          onClick: () => navigate(`/#/${APP_NAME}/${value}`),
        },
        index,
      ),
    );

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: t('breadcrumb_root_label'),
      onClick: () => navigate(urls.listing),
    },
    ...paths,
  ];

  return (
    <OdsBreadcrumb>
      {breadcrumbItems?.map((item) => (
        <OdsBreadcrumbItem
          key={`breadcrumb-key-${item.label}`}
          href={item.href}
          label={item.label}
          onClick={item.onClick}
        />
      ))}
    </OdsBreadcrumb>
  );
}
