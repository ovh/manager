import {
  getProjectQuery,
  useIsDiscoveryProject,
  useProject,
} from './useProject';
import { PublicCloudProject as Project } from './publicCloudProject.interface';

export type PublicCloudProject = Project;

export { useProject, useIsDiscoveryProject, getProjectQuery };
