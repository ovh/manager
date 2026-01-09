import { useLocation, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import './breadcrumb.scss';

import { urls } from '@/routes/routes.constant';
import { APP_NAME } from '@/tracking.constant';
import { TRANSLATION_NAMESPACES } from '@/utils';

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
  const { t } = useTranslation(TRANSLATION_NAMESPACES.ips);
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split('/').filter(Boolean);
  const paths = pathnames
    .filter((value) => value !== 'ip')
    .map((value, index) =>
      mapper(
        {
          label: t(value),
          onClick: () => {
            navigate(`/#/${APP_NAME}/${value}`);
          },
        },
        index,
      ),
    );

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: t('breadcrumb_root_label'),
      onClick: () => {
        navigate(urls.listing);
      },
    },
    ...paths,
  ];

  return (
    <OdsBreadcrumb>
      {breadcrumbItems?.map((item, index) => (
        <OdsBreadcrumbItem
          key={`breadcrumb-key-${item.label}-${index}`}
          className="ips-breadcrumb-item"
          href={item.href}
          label={item.label}
          onClick={item.onClick}
        />
      ))}
    </OdsBreadcrumb>
  );
}
