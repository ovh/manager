import { DeploymentType } from '@/types/sapCapabilities.type';
import { ApplicationServer } from '@/types/servers.type';
import { DEFAULT_APPLICATION_SERVER } from './defaultServers.constants';

export const createApplicationServer = (
  base?: Partial<ApplicationServer>,
): ApplicationServer => ({ ...DEFAULT_APPLICATION_SERVER, ...base });

export const getDefaultApplicationServers = (
  deploymentType: DeploymentType,
): ApplicationServer[] => {
  switch (deploymentType) {
    case 'High Availability':
      return [
        createApplicationServer({ role: 'SCS' }),
        createApplicationServer({ role: 'ERS' }),
        createApplicationServer({ role: 'CI' }),
        createApplicationServer({ role: 'DI' }),
      ];
    case 'Distributed':
      return [
        createApplicationServer({ role: 'SCS' }),
        createApplicationServer({ role: 'CI' }),
      ];
    case 'Standard':
    default:
      return [createApplicationServer({ role: 'SCS' })];
  }
};

export const isDefaultApplicationServer = ({
  serverIndex,
  deploymentType,
}: {
  serverIndex: number;
  deploymentType: DeploymentType;
}): boolean => {
  const deployments: Record<DeploymentType, number[]> = {
    Standard: [0],
    Distributed: [0, 1],
    'High Availability': [0, 1, 2, 3],
  };

  return deployments[deploymentType]?.includes(serverIndex) ?? false;
};

export const isApplicationServerDeletable = ({
  serverIndex,
  deploymentType,
}: {
  serverIndex: number;
  deploymentType: DeploymentType;
}): boolean => {
  return !(
    isDefaultApplicationServer({ serverIndex, deploymentType }) &&
    serverIndex !== 3
  );
};
