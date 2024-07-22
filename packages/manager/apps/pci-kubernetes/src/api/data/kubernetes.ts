import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';

export type TKube = {
  id: string;
  region: string;
  name: string;
  url: string;
  attachedTo?: string;
  nodesUrl: string;
  version: string;
  nextUpgradeVersions: string[];
  kubeProxyMode: string;
  customization: {
    apiServer: {
      admissionPlugins: {
        enabled: string[];
        disabled: string[];
      };
    };
  };
  status: string;
  updatePolicy: string;
  isUpToDate: boolean;
  controlPlaneIsUpToDate: boolean;
  privateNetworkId: string;
  nodesSubnetId: string;
  privateNetworkConfiguration: {
    privateNetworkRoutingAsDefault: boolean;
    defaultVrackGateway: string;
  };
  createdAt: string;
  updatedAt: string;
  auditLogsSubscribed: boolean;
};

export const getAllKube = async (projectId: string): Promise<TKube[]> => {
  const { data } = await fetchIcebergV6<TKube>({
    route: `/cloud/project/${projectId}/kube`,
  });

  return data;
};
