import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { urls } from '@/routes/routes.constants';

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

  const overviewUrlValue =
    overviewUrl ||
    (serviceName ? urls.overview.replace(':serviceName', serviceName) : '/');

  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbParts = pathParts.slice(1);
  const breadcrumbItems = [
    {
      label: t('zimbra_dashboard_title'),
      onClick: () => navigate(urls.root),
    },
    serviceName && {
      label: serviceName,
      onClick: () => navigate(overviewUrlValue),
    },
    ...breadcrumbParts.map((part, index) => {
      const url = `/${pathParts.slice(0, index + 2).join('/')}`;
      const label = t(`zimbra_dashboard_${part}`);
      return {
        label,
        onClick: () => navigate(url),
      };
    }),
    ...items,
  ].filter(Boolean);

  return <OsdsBreadcrumb className="mb-4" items={breadcrumbItems} />;
};

export default Breadcrumb;
