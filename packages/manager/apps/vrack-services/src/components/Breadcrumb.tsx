import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { urls } from '@/router/constants';

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
    <OsdsBreadcrumb
      className="mb-4"
      items={[
        {
          label: t('listingCrumb'),
          onClick: () => navigate(urls.listing),
        },
        id && {
          label: id,
          onClick: () => navigate(overviewUrl || `/${id}`),
        },
        ...items,
      ].filter(Boolean)}
    />
  );
};
