import { useLocation, Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  Breadcrumb as OdsBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@ovhcloud/ods-react';

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

  const pathnames = location.pathname.split('/').filter(Boolean);
  const paths = pathnames
    .filter((value) => value !== 'ip')
    .map((value, index) =>
      mapper(
        {
          label: t(value),
          href: `/#/${APP_NAME}/${value}`,
        },
        index,
      ),
    );

  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: t('breadcrumb_root_label'),
      href: urls.listing,
    },
    ...paths,
  ];

  return (
    <OdsBreadcrumb>
      {breadcrumbItems?.map((item, index) => (
        <BreadcrumbItem key={`breadcrumb-key-${item.label}-${index}`}>
          <BreadcrumbLink as={Link} to={item.href}>
            {item.label}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </OdsBreadcrumb>
  );
}
