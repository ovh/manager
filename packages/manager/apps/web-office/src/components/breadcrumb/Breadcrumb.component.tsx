import React, { useMemo } from 'react';

import { useLocation } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_LINK_COLOR } from '@ovhcloud/ods-components';
import { OdsBreadcrumb, OdsBreadcrumbItem } from '@ovhcloud/ods-components/react';

import { useParentTenant } from '@/data/hooks/parent-tenant/useParentTenant';

export type BreadcrumbProps = {
  items?: { label: string; href?: string }[];
  overviewUrl?: string;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = () => {
  const { data } = useParentTenant();
  const serviceName = data?.serviceName;
  const { t } = useTranslation('common');
  const location = useLocation();

  const rootUrl = serviceName ? '#/license/:serviceName'.replace(':serviceName', '') : '#/';

  const breadcrumbItems = useMemo(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const breadcrumbParts = pathParts.slice(2);
    return [
      {
        label: t('common_office_title'),
        href: rootUrl,
      },
      pathParts.length > 1
        ? {
            label: serviceName,
            href: `#/${pathParts.slice(0, 2).join('/')}`,
          }
        : null,
      ...breadcrumbParts.map((_, index) => {
        const label = t(
          `${breadcrumbParts
            .slice(0, index + 1)
            .join('_')
            .replace(/-/g, '_')}`,
        );
        const url = `#/${pathParts.slice(0, index + 2).join('/')}`;
        return {
          label,
          href: url,
        };
      }),
    ].filter(Boolean);
  }, [location, serviceName, rootUrl, t]);
  return (
    <OdsBreadcrumb data-testid="breadcrumb" className="mb-4">
      {breadcrumbItems.map((item) => (
        <OdsBreadcrumbItem
          key={item.label || item.href}
          href={item.href}
          color={ODS_LINK_COLOR.primary}
          label={item.label}
          target="_self"
        />
      ))}
    </OdsBreadcrumb>
  );
};

export default Breadcrumb;
