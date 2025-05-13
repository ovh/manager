import React, { useState } from 'react';
import { Params, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { useProject } from '@ovh-ux/manager-pci-common';

export type BreadcrumbHandleParams = {
  data: unknown;
  params: Params<string>;
};

interface BreadcrumbProps {
  items?: { label: string }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items = [] }) => {
  const { projectId } = useParams();
  const { t } = useTranslation('listing');
  const { data: project } = useProject();

  const navigation = useNavigation();
  const [urlProject, setUrlProject] = useState('');
  React.useEffect(() => {
    const updateNav = async () => {
      const url = await navigation.getURL(
        'public-cloud',
        `#/pci/projects/${projectId}`,
        {},
      );
      setUrlProject(url as string);
    };
    updateNav();
  }, [navigation, projectId]);

  return (
    <OsdsBreadcrumb
      items={[
        {
          href: urlProject,
          label: project?.description,
        },
        {
          href: `${urlProject}/rancher`,
          label: t('rancherTitle'),
        },
        ...items,
      ]}
    ></OsdsBreadcrumb>
  );
};

export default Breadcrumb;
