import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { useProject } from '@ovh-ux/manager-pci-common';
import { useProjectUrl } from '@ovh-ux/manager-react-components';

const BreadcrumbCIDR = () => {
  const { data: project } = useProject();
  const hrefBack = useHref('..');
  const hrefProject = useProjectUrl('public-cloud');
  const { t } = useTranslation(['ip-restrictions', 'common']);
  return (
    <OsdsBreadcrumb
      items={[
        {
          href: hrefProject,
          label: project?.description,
        },
        {
          href: hrefBack,
          label: t('common:private_registry_title'),
        },
        {
          label: t('private_registry_cidr_manage_title'),
        },
      ]}
    />
  );
};

export default BreadcrumbCIDR;
