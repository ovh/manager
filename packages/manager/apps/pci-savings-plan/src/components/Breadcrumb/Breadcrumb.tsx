import React, { useState } from 'react';
import { Params, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OsdsBreadcrumb } from '@ovhcloud/ods-components/react';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';

import { useProject } from '@ovh-ux/manager-pci-common';

export type BreadcrumbHandleParams = {
  data: unknown;
  params: Params<string>;
};

const getPageName = (location: string, t: (key: string) => string) => {
  if (location.includes('new')) {
    return [
      {
        label: t('createSavingsPlan'),
      },
    ];
  }
  return [];
};

const Breadcrumb: React.FC = () => {
  const { projectId } = useParams();
  const { t } = useTranslation('listing');
  const { data: project } = useProject();
  const location = useLocation();

  const navigation = useNavigation();
  const [urlProject, setUrlProject] = useState('');

  const items = getPageName(location.pathname, t);

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
          href: `${urlProject}/savings-plan`,
          label: t('title'),
        },
        ...items,
      ]}
    ></OsdsBreadcrumb>
  );
};

export default Breadcrumb;
