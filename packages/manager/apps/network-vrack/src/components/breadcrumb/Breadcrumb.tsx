import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BreadcrumbItem, BreadcrumbLink, Breadcrumb as OdsBreadcrumb } from '@ovhcloud/ods-react';

import { useNavigateToLegacyApp } from '@/hooks/useNavigateToLegacyApp';
import { urls } from '@/routes/Routes.constants';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

type BreadcrumbSegment = {
  label: string;
  onClick: () => void;
};

export const Breadcrumb = () => {
  const { t } = useTranslation([TRANSLATION_NAMESPACES.dashboard]);
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const navigateToLegacy = useNavigateToLegacyApp();

  const segments: BreadcrumbSegment[] = [
    {
      label: t('dashboard_vrackBreadcrumbLabel'),
      onClick: () => void navigateToLegacy(),
    },
    serviceName && {
      label: serviceName,
      onClick: () => navigate(urls.dashboard.replace(':serviceName', serviceName)),
    },
  ].filter(Boolean) as BreadcrumbSegment[];

  return (
    <OdsBreadcrumb className="mb-4">
      {segments.map((item) => (
        <BreadcrumbItem key={item.label}>
          <BreadcrumbLink onClick={item.onClick}>{item.label}</BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </OdsBreadcrumb>
  );
};
