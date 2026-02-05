import { useApplicationHubUrl } from '@/hooks/url/useApplicationHubUrl';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import {
  Breadcrumb as ODSBreadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
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

  const applicationHubUrl = useApplicationHubUrl();

  const breadcrumbItems = [
    { label: projectLabel, href: projectUrl },
    { label: t('pci_instances_common_instances_title'), href: backHref },
    ...items,
  ];

  return (
    <ODSBreadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href={applicationHubUrl}>
          <Icon
            name="home"
            aria-label="home"
            role="img"
            className="text-xl/4"
          />
        </BreadcrumbLink>
      </BreadcrumbItem>
      {breadcrumbItems.map((item) => (
        <BreadcrumbItem key={item.label}>
          <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </ODSBreadcrumb>
  );
};
