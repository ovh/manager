import React, { useEffect, useState } from 'react';
import { Params, useParams } from 'react-router-dom';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import usePciProject from '../../hooks/usePciProject';

export type BreadcrumbHandleParams = {
  data: unknown;
  params: Params<string>;
};

interface BreadcrumbProps {
  items?: { label: string }[];
}

function Breadcrumb({ items = [] }: BreadcrumbProps): JSX.Element {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-rancher/listing');
  const { data: project } = usePciProject();

  const navigation = useNavigation();
  const [urlProject, setUrlProject] = useState('');
  useEffect(() => {
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
          label: t('rancherTitle'),
        },
        ...items,
      ]}
    ></OsdsBreadcrumb>
  );
}

export default Breadcrumb;
