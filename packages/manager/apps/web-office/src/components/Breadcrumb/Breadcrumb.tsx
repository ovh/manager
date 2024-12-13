import React, { useMemo } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_LINK_COLOR } from '@ovhcloud/ods-components';

export type BreadcrumbProps = {
  items?: { label: string; href?: string }[];
  overviewUrl?: string;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = () => {
  const { serviceName } = useParams();
  const { t } = useTranslation('dashboard');
  const location = useLocation();

  const rootUrl = serviceName
    ? '#/license/:serviceName'.replace(':serviceName', '')
    : '#/';

  const breadcrumbItems = useMemo(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const breadcrumbParts = pathParts.slice(2);
    return [
      {
        label: 'Mes comptes Microsoft 365',
        href: rootUrl,
      },
      {
        label: pathParts[1],
        href: `#/${pathParts.slice(0, 2).join('/')}`,
      },
      ...breadcrumbParts.map((_, index) => {
        const label = t(
          `microsoft_office_dashboard_${breadcrumbParts
            .slice(0, index + 1)
            .join('_')}`,
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
          key={item.label}
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
