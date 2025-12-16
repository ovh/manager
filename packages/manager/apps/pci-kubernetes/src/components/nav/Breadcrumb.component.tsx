import { FC, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import {
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
  Breadcrumb as ODSBreadcrumb,
} from '@ovhcloud/ods-react';

import { useProjectUrl } from '@ovh-ux/manager-react-components';

import { computeBreadcrumbUrl } from '@/helpers/nav/url';

type TBreadcrumb = {
  items: Array<{ label: string; ariaLabel?: string }>;
};

export const Breadcrumb: FC<TBreadcrumb> = ({ items }) => {
  const { t } = useTranslation(['common']);

  const projectUrl = useProjectUrl('public-cloud');

  const crumbs = useMemo(() => computeBreadcrumbUrl(items, window.location.hash), [items]);

  return (
    <ODSBreadcrumb aria-label={t('common_breadcrumb')}>
      <BreadcrumbItem>
        <BreadcrumbLink href={projectUrl}>
          <Icon name="home" />
        </BreadcrumbLink>
      </BreadcrumbItem>
      {crumbs.map(({ href, label, ariaLabel }, index) => (
        <BreadcrumbItem key={index}>
          <BreadcrumbLink href={href} aria-label={ariaLabel}>
            {label}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </ODSBreadcrumb>
  );
};
