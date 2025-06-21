import React from 'react';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { urls } from '@/routes/routes.constant';
import { APP_NAME } from '@/tracking.constant';

export function Breadcrumb(): JSX.Element {
  const { t } = useTranslation('ips');
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split('/').filter(Boolean);
  const paths = pathnames
    .filter((value) => value !== 'ip')
    .map((value) => ({
      label: t(value),
      onClick: () => navigate(`/#/${APP_NAME}/${value}`),
    }));

  const breadcrumbItems: {
    label: string;
    href?: string;
    onClick?: () => void;
  }[] = [
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
          key={item.label}
          href={item.href}
          label={item.label}
          onClick={item.onClick}
        />
      ))}
    </OdsBreadcrumb>
  );
}
