import { DeploymentType } from '@/types/sapCapabilities.type';
import { ApplicationServer } from '@/types/servers.type';
import { DEFAULT_APPLICATION_SERVER } from './defaultServers.constants';
import { SERVER_ROLE } from './applicationServers.constants';

export const createApplicationServer = (
  base?: Partial<ApplicationServer>,
): ApplicationServer => ({ ...DEFAULT_APPLICATION_SERVER, ...base });

export const getDefaultApplicationServers = (
  deploymentType: DeploymentType,
): ApplicationServer[] => {
  switch (deploymentType) {
    case 'High Availability':
      return [
        createApplicationServer({ role: SERVER_ROLE.scs }),
        createApplicationServer({ role: SERVER_ROLE.ers }),
        createApplicationServer({ role: SERVER_ROLE.ci }),
        createApplicationServer({ role: SERVER_ROLE.di }),
      ];
    case 'Distributed':
      return [
        createApplicationServer({ role: SERVER_ROLE.scs }),
        createApplicationServer({ role: SERVER_ROLE.ci }),
      ];
    case 'Standard':
    default:
      return [createApplicationServer({ role: SERVER_ROLE.scs })];
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

export const isValidApplicationServerList = ({
  deploymentType,
  applicationServers: vms,
}: {
  deploymentType: DeploymentType;
  applicationServers: ApplicationServer[];
}): boolean => {
  if (!vms || !vms.length) return false;
  switch (deploymentType) {
    case 'High Availability':
      if (vms.length < 3) return false;
      return (
        vms[0].role === SERVER_ROLE.scs &&
        vms[1].role === SERVER_ROLE.ers &&
        vms[2].role === SERVER_ROLE.ci &&
        vms.slice(3).every((vm) => vm.role === SERVER_ROLE.di)
      );
    case 'Distributed':
      if (vms.length < 2) return false;
      return (
        vms[0].role === SERVER_ROLE.scs &&
        vms[1].role === SERVER_ROLE.ci &&
        vms.slice(2).every((vm) => vm.role === SERVER_ROLE.di)
      );
    case 'Standard':
    default:
      return (
        vms[0].role === SERVER_ROLE.scs &&
        vms.slice(1).every((vm) => vm.role === SERVER_ROLE.di)
      );
  }
};
