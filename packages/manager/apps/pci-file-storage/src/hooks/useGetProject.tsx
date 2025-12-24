import { useEffect, useState } from 'react';

import { useProject } from '@ovh-ux/manager-pci-common';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';

export type TProject = {
  id: string;
  name: string;
  url: string;
};

export const useGetProject = () => {
  const navigation = useNavigation();
  const { data: project } = useProject();

  const [projectUrl, setProjectUrl] = useState('');

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${project?.project_id ?? ''}`, {})
      .then((data) => {
        setProjectUrl(data as string);
      });
  }, [project, navigation]);

  return {
    id: project?.project_id,
    name: project?.description,
    url: projectUrl,
  } as TProject;
};
