export type DeploymentType = 'Standard' | 'Distributed' | 'High Availability';
export type SAPRole = 'SCS' | 'CI' | 'ERS' | 'DI';

export type SapCapabilities = {
  applicationTypes: string[];
  applicationVersions: string[];
  deploymentTypes: DeploymentType[];
  ovaTemplates: string[];
  sapRoles: SAPRole[];
};
