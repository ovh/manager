import { Filter } from '@/api/filters';
import { fetchIceberg } from '@/api/iceberg';
import apiClient from '@/api/client';

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

type NutanixList = {
  totalCount: number;
  data: Nutanix[];
};

type NutanixMetaInfos = {
  region: string;
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
  const response = await apiClient.get(`/dedicated/server/${serverId}`);
  return { region: response.data.datacenter };
}

export default Nutanix;
