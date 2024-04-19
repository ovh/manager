import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { urls } from './constants';

export type BreadcrumbProps = {
  items?: { label: string; href?: string }[];
  overviewUrl?: string;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items = [],
  overviewUrl,
}) => {
  const { serviceName } = useParams();
  const { t } = useTranslation('zimbra/dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  const overviewUrlValue =
    overviewUrl ||
    (serviceName ? urls.overview.replace(':serviceName', serviceName) : '/');

  const activeTab = location.pathname.split('/')[2];
  const activeTabTranslation = t(activeTab);
  return (
    <OsdsBreadcrumb
      className="mb-4"
      items={[
        {
          label: t('title'),
          onClick: () => navigate(urls.listing),
        },
        serviceName && {
          label: serviceName,
          onClick: () => navigate(overviewUrlValue),
        },
        activeTab && {
          label: t(activeTabTranslation),
          onClick: () => navigate(location.pathname),
        },
        ...items,
      ].filter(Boolean)}
    />
  );
};

export default Breadcrumb;
