import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
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
  const { id } = useParams();
  const { t } = useTranslation('vrack-services');
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
        .filter(Boolean)
        .map((item: { label: string; href?: string; onClick?: () => void }) => (
          <OdsBreadcrumbItem key={item.label} href={item.href} {...item} />
        ))}
    </OdsBreadcrumb>
  );
};
