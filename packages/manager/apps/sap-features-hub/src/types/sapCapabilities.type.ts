import { APPLICATION_SERVER_ROLES } from '@/utils/applicationServers.constants';

export type DeploymentType = 'Standard' | 'Distributed' | 'High Availability';

export type SapCapabilities = {
  applicationTypes: string[];
  applicationVersions: string[];
  deploymentTypes: DeploymentType[];
  ovaTemplates: string[];
  sapRoles: typeof APPLICATION_SERVER_ROLES;
};
