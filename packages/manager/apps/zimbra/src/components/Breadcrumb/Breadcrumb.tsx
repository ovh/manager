import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { urls } from '@/routes/routes.constants';
import { useGenerateUrl, useOrganization } from '@/hooks';

export type BreadcrumbProps = {
  items?: { label: string; href?: string }[];
  overviewUrl?: string;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items = [],
  overviewUrl,
}) => {
  const { serviceName } = useParams();
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const location = useLocation();
  const { data: organization, isLoading } = useOrganization();

  const overviewUrlValue = useGenerateUrl(
    overviewUrl ||
      (serviceName ? urls.overview.replace(':serviceName', serviceName) : '/'),
    'path',
  );
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbParts = pathParts.slice(1);
  const breadcrumbItems = [
    {
      label: t('zimbra_dashboard_title'),
      onClick: () => navigate(urls.root),
    },
    ...(organization && !isLoading
      ? [
          {
            label: organization?.currentState.name,
            onClick: () => navigate(overviewUrlValue),
          },
        ]
      : []),
    ...breadcrumbParts.map((_, index) => {
      const url = `/${pathParts
        .slice(0, index + 2)
        .join('/')}${location.search ?? ''}`;
      const label = t(
        `zimbra_dashboard_${breadcrumbParts.slice(0, index + 1).join('_')}`,
      );
      return {
        label,
        onClick: () => navigate(url),
      };
    }),
    ...items,
  ].filter(Boolean);

  return (
    <OsdsBreadcrumb
      data-testid="breadcrumb"
      className="mb-4"
      items={breadcrumbItems}
    />
  );
};

export default Breadcrumb;
