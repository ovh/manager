import { FC, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import {
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
  Breadcrumb as ODSBreadcrumb,
} from '@ovhcloud/ods-react';

import { useProject } from '@ovh-ux/manager-pci-common';

import { computeBreadcrumbUrl, getProjectUrl } from '@/helpers/nav/url';

type TBreadcrumbEntry = {
  label: string;
  ariaLabel?: string;
};

type TBreadcrumbProps = {
  entries: Array<TBreadcrumbEntry>;
};

export const Breadcrumb: FC<TBreadcrumbProps> = ({ entries }) => {
  const { t } = useTranslation(['common']);

  const { data: project } = useProject();
  const projectUrl = useMemo(() => getProjectUrl(), []);
  const crumbs = useMemo(
    () => computeBreadcrumbUrl<Partial<TBreadcrumbEntry>>(entries, window.location.hash),
    [entries],
  );

  return (
    <ODSBreadcrumb aria-label={t('common_breadcrumb')}>
      <BreadcrumbItem>
        <BreadcrumbLink href={projectUrl} aria-label={project?.description} target="_self">
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
