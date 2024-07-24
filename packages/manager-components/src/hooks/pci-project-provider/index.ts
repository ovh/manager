import { PublicCloudProject as Project } from './publicCloudProject.interface';
import {
  getProjectQuery,
  useIsDiscoveryProject,
  useProject,
  useProjectQuota,
} from './useProject';

export type PublicCloudProject = Project;

export { getProjectQuery, useIsDiscoveryProject, useProject, useProjectQuota };
