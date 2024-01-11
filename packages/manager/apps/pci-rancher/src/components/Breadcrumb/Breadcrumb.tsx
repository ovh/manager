import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Params, useParams } from 'react-router-dom';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { getProject } from '@/api';

export type BreadcrumbHandleParams = {
  data: unknown;
  params: Params<string>;
};

function Breadcrumb(): JSX.Element {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-rancher/listing');
  const { data: project } = useQuery({
    queryKey: ['projectId', projectId],
    queryFn: () => getProject(projectId),
  });

  const navigation = useNavigation();

  const [urlProject, setUrlProject] = useState('');
  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setUrlProject(data as string);
      });
  });

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
      ]}
    ></OsdsBreadcrumb>
  );
}

export default Breadcrumb;
