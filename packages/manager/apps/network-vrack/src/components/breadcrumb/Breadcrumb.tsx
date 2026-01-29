import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BreadcrumbItem, BreadcrumbLink, Breadcrumb as OdsBreadcrumb } from '@ovhcloud/ods-react';

import { useNavigateToLegacyApp } from '@/hooks/useNavigateToLegacyApp';
import { urls } from '@/routes/Routes.constants';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

export const Breadcrumb = () => {
  const { t } = useTranslation([TRANSLATION_NAMESPACES.dashboard]);
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const navigateToLegacy = useNavigateToLegacyApp();

  const segments: { label: string; href?: string; onClick?: () => void }[] = [
    {
      label: t('dashboard_vrackBreadcrumbLabel'),
      onClick: () => void navigateToLegacy(),
    },
  ];
  if (serviceName) {
    segments.push({
      label: serviceName,
      onClick: () => navigate(urls.dashboard.replace(':serviceName', serviceName)),
    });
  }

  return (
    <OdsBreadcrumb className="mb-4">
      {segments
        .filter((item): item is { label: string; href?: string; onClick?: () => void } =>
          Boolean(item),
        )
        .map((item) => (
          <BreadcrumbItem key={item.label}>
            <BreadcrumbLink href={item.href} onClick={() => item.onClick?.()}>
              {item.label}
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))}
    </OdsBreadcrumb>
  );
};
