import { useProjectUrl } from '@ovh-ux/manager-react-components';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
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

  return (
    <OsdsBreadcrumb
      items={[
        {
          href: projectUrl,
          label: projectLabel,
        },
        {
          href: backHref,
          label: t('pci_instances_common_instances_title'),
        },
        ...items,
      ]}
    />
  );
};
