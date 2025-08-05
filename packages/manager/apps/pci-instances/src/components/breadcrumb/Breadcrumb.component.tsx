import { useProjectUrl } from '@ovh-ux/manager-react-components';
import {
  BreadcrumbItem,
  Breadcrumb as ODSBreadcrumb,
  BreadcrumbLink,
} from '@ovhcloud/ods-react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';

type TBreadcrumbItem = {
  label: string;
  href?: string;
};

export type TBreadcrumbProps = {
  items?: TBreadcrumbItem[];
  projectLabel: string;
};

export const Breadcrumb: FC<TBreadcrumbProps> = ({
  items = [],
  projectLabel,
}) => {
  const backHref = useHref('..');
  const projectUrl = useProjectUrl('public-cloud');
  const { t } = useTranslation('common');

  const breadcrumbItems = [
    { label: projectLabel, href: projectUrl },
    { label: t('pci_instances_common_instances_title'), href: backHref },
    ...items,
  ];

  return (
    <ODSBreadcrumb>
      {breadcrumbItems.map((item) => (
        <BreadcrumbItem key={item.href}>
          <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </ODSBreadcrumb>
  );
};
