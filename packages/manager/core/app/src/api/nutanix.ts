import { Filter } from '@/api/filters';
import { fetchIceberg, FetchPaginatedParams } from '@/api/iceberg';
import apiClient from '@/api/client';
import ServiceInfos, { getServiceInfos as getInfos } from './serviceInfos';
import Service, {
  getServiceOptions,
  getHardwareInfo,
  TechnicalDetails,
  BareMetalServerDetails,
  NutanixClusterDetails,
  BareMetalServerDetailsKeys,
} from '@/api/service';
import DedicatedServer, {
  getDedicatedServer,
  getDedicatedServerOption,
  getDedicatedServerOrderableBandwidthVrack,
  getNetwordSpecifications,
  DedicatedServerOption,
  NetworkSpecifications,
  DedicatedServerBandwidthvRackOrderable,
  DedicatedServerOptionEnum,
} from '@/api/dedicatedServer';

export type NutanixTargetSpecNode = {
  ahvIp: string;
  cvmIp: string;
  server: string;
};

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
    nodes: NutanixTargetSpecNode[];
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

export type NutanixNodeIntervention = {
  date: Date;
  type: string;
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
  const { data } = await apiClient.v6.get(`/nutanix/${serviceName}`);
  return data;
}

export async function getServiceInfos(
  serviceName: string,
): Promise<ServiceInfos> {
  const response = await getInfos('nutanix', serviceName);
  return response;
}

export async function getNodeInterventions(
  serviceName: string,
  count = 10,
  offset = 1,
): Promise<{
  count: number;
  list: {
    results: NutanixNodeIntervention[];
  };
}> {
  const { data } = await apiClient.aapi.get(
    `/sws/dedicated/server/${serviceName}/interventions`,
    {
      params: {
        count,
        offset,
      },
    },
  );
  return data;
}

export type NodeTask = {
  lastUpdate: Date;
  function: string;
  comment: string;
  status: string;
};

export type NodeTasksList = {
  totalCount: number;
  data: NodeTask[];
};

export async function getNodeTasks(
  serviceName: string,
  {
    page,
    pageSize,
    filters,
    sortBy,
    sortReverse,
  }: Partial<FetchPaginatedParams>,
): Promise<NodeTasksList> {
  return fetchIceberg({
    route: `/dedicated/server/${serviceName}/task`,
    page,
    pageSize,
    filters,
    sortBy,
    sortReverse,
  });
}

function determineServerServiceName(
  service: string | Nutanix | NutanixTargetSpecNode,
): string {
  let serviceName = service as string;
  if ((service as Nutanix).targetSpec) {
    serviceName = (service as Nutanix).targetSpec.nodes[0].server;
  } else if ((service as NutanixTargetSpecNode).server) {
    serviceName = (service as NutanixTargetSpecNode).server;
  }
  return serviceName;
}

export async function getServer(
  server: string | Nutanix | NutanixTargetSpecNode,
): Promise<DedicatedServer> {
  return getDedicatedServer(determineServerServiceName(server));
}

export async function getServerNetworkSpecifications(
  server: string | Nutanix | NutanixTargetSpecNode,
): Promise<NetworkSpecifications> {
  return getNetwordSpecifications(determineServerServiceName(server));
}

export async function getServerOption(
  server: string | Nutanix | NutanixTargetSpecNode,
  serverOption: DedicatedServerOptionEnum,
): Promise<DedicatedServerOption> {
  return getDedicatedServerOption(
    determineServerServiceName(server),
    serverOption,
  );
}

export async function getServerOrderableBandwidthVrack(
  server: string | Nutanix | NutanixTargetSpecNode,
): Promise<DedicatedServerBandwidthvRackOrderable> {
  return getDedicatedServerOrderableBandwidthVrack(
    determineServerServiceName(server),
  );
}

function transformTechnicalDetails(
  optionsHardwareInfo: Array<TechnicalDetails>,
): TechnicalDetails {
  const baremetalServers = {} as BareMetalServerDetails;
  let nutanixCluster = {} as NutanixClusterDetails;
  optionsHardwareInfo.forEach((hardwareInfo) => {
    if (hardwareInfo.baremetalServers) {
      const keys = Object.keys(
        hardwareInfo.baremetalServers,
      ) as BareMetalServerDetailsKeys[];
      keys.forEach((key) => {
        if (hardwareInfo.baremetalServers[key]) {
          if (key === 'storage' && baremetalServers.storage) {
            baremetalServers.storage.disks = [
              ...baremetalServers.storage.disks,
              ...hardwareInfo.baremetalServers.storage.disks,
            ];
          } else {
            (baremetalServers as Record<BareMetalServerDetailsKeys, unknown>)[
              key
            ] = {
              ...hardwareInfo.baremetalServers[key],
              // serviceId: hardwareInfo.serviceId,
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
