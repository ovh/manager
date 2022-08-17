import { Filter } from '@/api/filters';
import { fetchIceberg } from '@/api/iceberg';
import apiClient from '@/api/client';
import ServiceInfos, { getServiceInfos as getInfos } from './serviceInfos';
import Service, {
  getServiceOptions,
  getHardwareInfo,
  TechnicalDetails,
  BareMetalServersDetails,
  NutanixClusterDetails,
} from './service';

export type Nutanix = {
  allowedRedundancyFactor: number[];
  availableVersions: string[];
  serviceName: string;
  status: string;
  targetSpec: {
    controlPanelURL: string;
    erasureCoding: boolean;
    gatewayCidr: string;
    ipfo: string;
    iplb: string;
    name: string;
    nodes: {
      ahvIp: string;
      cvmIp: string;
      server: string;
    }[];
    prismCentral: {
      ips: string[];
      type: string;
      vip: string;
    };
    prismElementVip: string;
    prismSecretId: string;
    rackAwareness: boolean;
    redundancyFactor: number;
    version: string;
    vrack: string;
  };
};

export type Server = {
  datacenter: string;
  rack: string;
  serviceId: number;
};

type NutanixList = {
  totalCount: number;
  data: Nutanix[];
};

type NutanixMetaInfos = {
  region: string;
};

export type NutanixNode = {
  serviceName: string;
  displayName: string;
};

export type NutanixNodeMetaInfos = {
  commercialRange: string;
  datacenter: string;
  state: string;
};

export type ListNutanixParams = {
  currentPage: number;
  pageSize: number;
  filters?: Filter[];
  sortBy?: string;
  sortReverse?: boolean;
};

export async function listNutanix({
  currentPage,
  pageSize,
  filters,
  sortBy,
  sortReverse,
}: ListNutanixParams): Promise<NutanixList> {
  return fetchIceberg({
    route: '/nutanix',
    page: currentPage,
    pageSize,
    filters,
    sortBy,
    sortReverse,
  });
}

export async function fetchNutanixMetaInfos(
  nutanix: Nutanix,
): Promise<NutanixMetaInfos> {
  const serverId = nutanix.targetSpec.nodes[0].server;
  const response = await apiClient.v6.get(`/dedicated/server/${serverId}`);
  return { region: response.data.datacenter };
}

export async function listNutanixNodes(
  serviceName: string,
): Promise<NutanixNode[]> {
  const { data } = await apiClient.aapi.get(
    `/service?external=false&type=${encodeURIComponent(
      `/nutanix/${serviceName}`,
    )}`,
  );
  return data;
}

export async function fetchNutanixNodeMetaInfos(
  serviceName: string,
): Promise<NutanixNodeMetaInfos> {
  const response = await apiClient.aapi.get(
    `/sws/dedicated/server/${serviceName}`,
  );
  return response.data;
}

export async function getNutanix(serviceName: string): Promise<Nutanix> {
  const response = await apiClient.v6.get(`/nutanix/${serviceName}`);
  return response.json();
}

export async function getServer(nodeId: number): Promise<any> {
  const response = await apiClient.aapi.get(`/sws/dedicated/server/${nodeId}`);
  return response.json();
}

export function transformTechnicalDetails(
  optionsHardwareInfo: Array<TechnicalDetails>,
): TechnicalDetails {
  const baremetalServers = {} as BareMetalServersDetails;
  let nutanixCluster = {} as NutanixClusterDetails;
  optionsHardwareInfo.forEach((hardwareInfo) => {
    if (hardwareInfo.baremetalServers) {
      const keys = Object.keys(
        hardwareInfo.baremetalServers,
      ) as (keyof typeof hardwareInfo.baremetalServers)[];
      keys.forEach((key) => {
        if (hardwareInfo.baremetalServers[key]) {
          const value = hardwareInfo.baremetalServers[key] as Record<
            string,
            unknown
          >;
          if (key === 'storage' && baremetalServers.storage) {
            baremetalServers.storage.disks = [
              ...baremetalServers.storage.disks,
              ...hardwareInfo.baremetalServers.storage.disks,
            ];
          } else {
            baremetalServers[key] = {
              ...value,
              serviceId: hardwareInfo.serviceId,
            };
          }
        }
      });
    }
    if (hardwareInfo.nutanixCluster) {
      // only one nutanix cluster, no need merge the results
      nutanixCluster = hardwareInfo.nutanixCluster;
    }
  });
  return {
    baremetalServers,
    nutanixCluster,
  };
}

export async function getTechnicalDetails(
  serviceId: number,
  nodeServiceId: number,
): Promise<TechnicalDetails> {
  const options = await getServiceOptions(serviceId);
  const optionsServiceId = [nodeServiceId, serviceId];
  options.forEach((option: Service) => {
    optionsServiceId.push(option.serviceId);
  });
  const optionsHardwareInfo = await Promise.all(
    optionsServiceId.map(async (optionServiceId) =>
      getHardwareInfo(optionServiceId),
    ),
  );
  return transformTechnicalDetails(optionsHardwareInfo);
}

export default Nutanix;
