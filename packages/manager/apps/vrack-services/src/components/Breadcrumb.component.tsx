import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BreadcrumbItem, BreadcrumbLink, Breadcrumb as OdsBreadcrumb } from '@ovhcloud/ods-react';

import { urls } from '@/routes/RoutesAndUrl.constants';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

export type BreadcrumbProps = {
  items?: { label: string; href?: string }[];
  overviewUrl?: string;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items = [], overviewUrl }) => {
  const { id } = useParams();
  const { t } = useTranslation(TRANSLATION_NAMESPACES.common);
  const navigate = useNavigate();

  return (
    <OdsBreadcrumb className="mb-4">
      {[
        {
          label: t('listingCrumb'),
          onClick: () => navigate(urls.listing),
        },
        id && {
          label: id,
          onClick: () => navigate(overviewUrl || `/${id}`),
        },
        ...items,
      ]
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
