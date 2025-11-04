import { useEffect, useState } from 'react';
import { PciProject } from '@/container/nav-reshuffle/sidebar/ProjectSelector/PciProject';
import { useDefaultPublicCloudProject } from '../defaultPublicCloudProject/useDefaultPublicCloudProject';

interface ContainerURL {
  appId: string;
  appHash: string;
}

interface UsePciProjectSelectionParams {
  containerURL: ContainerURL;
  pciProjects: PciProject[] | undefined;
  navigationPlugin: any;
}

const extractProjectIdFromUrl = (appHash: string): string | undefined => {
  const pciProjectMatch = (appHash || '').match(/^\/pci\/projects\/([^/?]+)/);
  if (pciProjectMatch && pciProjectMatch.length >= 2) {
    return pciProjectMatch[1];
  }
  return undefined;
};

const findProjectById = (
  projectId: string | undefined,
  pciProjects: PciProject[],
): PciProject | undefined => {
  if (!projectId) return undefined;
  return pciProjects.find((p) => p.project_id === projectId);
};

const navigateToProject = (projectId: string, navigationPlugin: any): void => {
  navigationPlugin.navigateTo('public-cloud', `#/pci/projects/${projectId}`);
};

export const usePciProjectSelection = ({
  containerURL,
  pciProjects,
  navigationPlugin,
}: UsePciProjectSelectionParams) => {
  const [selectedPciProject, setSelectedPciProject] = useState<PciProject | null>(null);

  const {
    data: defaultPciProject,
    isFetched: isDefaultProjectFetched,
  } = useDefaultPublicCloudProject({
    select: (defaultProjectId: string | null) =>
      defaultProjectId
        ? pciProjects?.find(
            ({ project_id }) => project_id === defaultProjectId,
          ) || null
        : null,
    enabled: !pciProjects,
  });

  useEffect(() => {
    const { appHash } = containerURL;

    if (appHash.startsWith('/pci/projects/new')) {
      setSelectedPciProject(null);
      return;
    }

    if (!pciProjects?.length) return;

    const projectIdFromUrl = extractProjectIdFromUrl(appHash);
    const projectFromUrl = findProjectById(projectIdFromUrl, pciProjects);

    if (projectFromUrl) {
      setSelectedPciProject(projectFromUrl);
      return;
    }

    if (defaultPciProject) {
      setSelectedPciProject(defaultPciProject);
      if (!projectIdFromUrl) {
        navigateToProject(defaultPciProject.project_id, navigationPlugin);
      }
      return;
    }

    if (isDefaultProjectFetched) {
      const firstProject = pciProjects[0];
      setSelectedPciProject(firstProject);
      if (!projectIdFromUrl) {
        navigateToProject(firstProject.project_id, navigationPlugin);
      }
    }
  }, [containerURL, pciProjects, defaultPciProject, isDefaultProjectFetched, navigationPlugin]);

  return { selectedPciProject, setSelectedPciProject };
};
