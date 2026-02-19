import { useEffect, useMemo, useState } from 'react';

import { TProject, isDiscoveryProject, useProject } from '@ovh-ux/manager-pci-common';

import { useNavigation } from '@/hooks/useNavigation';

export type TPciProject = TProject & {
  id: string;
  name: string;
  url: string;
  isDiscovery: boolean;
};

export const useGetProject = (): TPciProject | undefined => {
  const navigation = useNavigation();
  const { data: project } = useProject();

  const isDiscovery = useMemo(() => isDiscoveryProject(project), [project]);

  const [projectUrl, setProjectUrl] = useState('');

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${project?.project_id ?? ''}`, {})
      .then((data) => {
        setProjectUrl(data as string);
      });
  }, [project, navigation]);

  return useMemo(
    () =>
      project && {
        ...project,
        id: project.project_id,
        name: project.description ?? '',
        url: projectUrl,
        isDiscovery,
      },
    [project, projectUrl, isDiscovery],
  );
};
