import { v6, fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import type { TVps, TVpsImage } from '@/domain/entities/vps';
import type {
  TVpsDTO,
  TVpsIpsDTO,
  TVpsDistributionDTO,
  TVpsServiceInfoDTO,
  TVpsDatacenterDTO,
  TVpsImageDTO,
} from '@/adapters/api/vps/dto.type';
import {
  mapVpsDtoToEntity,
  mapVpsImageDtoToEntity,
} from '@/adapters/api/vps/mapper';

// Type for the Iceberg VPS response (returns full objects, not just names)
type TIcebergVpsItem = {
  name: string;
  displayName: string;
  state: string;
  zone: string;
  zoneType: string;
  offerType: string;
  cluster: string;
  keymap: string | null;
  memoryLimit: number;
  netbootMode: string;
  slaMonitoring: boolean;
  monitoringIpBlocks: string[];
  vcore: number;
  model: {
    name: string;
    offer: string;
    version: string;
    vcore: number;
    memory: number;
    disk: number;
    maximumAdditionnalIp: number;
  };
  iam?: {
    id: string;
    urn: string;
    state: string;
  };
};

// Map Iceberg item to a simplified TVps for list view
const mapIcebergVpsToEntity = (item: TIcebergVpsItem): TVps => {
  // Extract datacenter from zone (e.g., "Region OpenStack: os-gra4" -> "gra4")
  const zoneMatch = item.zone.match(/os-([a-z0-9-]+)/i);
  const datacenter = zoneMatch ? zoneMatch[1] : item.zone;

  return {
    serviceName: item.name,
    displayName: item.displayName || item.name,
    state: item.state as TVps['state'],
    model: {
      name: item.model.name,
      offer: item.model.offer,
      version: item.model.version,
      vcore: item.model.vcore,
      memory: item.model.memory,
      disk: item.model.disk,
      maximumAdditionalIp: item.model.maximumAdditionnalIp,
    },
    location: {
      datacenter,
      country: '', // Not available in Iceberg response
      continent: '', // Not available in Iceberg response
    },
    network: {
      ipV4: '', // Not available in Iceberg response, loaded separately if needed
      ipV6: null,
      netbootMode: item.netbootMode as 'local' | 'rescue',
      slaMonitoring: item.slaMonitoring,
    },
    distribution: {
      id: '', // Not available in Iceberg response
      name: '', // Not available in Iceberg response
      language: null,
      available: true,
    },
    subscription: {
      creationDate: '', // Not available in Iceberg response
      expirationDate: null,
      autoRenew: false,
      renewPeriod: null,
    },
    zone: item.zone,
    cluster: item.cluster,
    keymap: item.keymap,
    memoryLimit: item.memoryLimit,
    offerType: item.offerType,
    monitoringIpBlocks: item.monitoringIpBlocks,
  };
};

export const getVpsList = async (): Promise<Array<TVps>> => {
  // Iceberg returns full VPS objects, not just service names
  const { data } = await fetchIcebergV6<TIcebergVpsItem>({
    route: '/vps',
  });

  // Map directly from Iceberg response
  const vpsList = data.map(mapIcebergVpsToEntity);

  // Fetch IP addresses for each VPS in parallel (Iceberg doesn't include IPs)
  // Note: The /vps/{serviceName}/ips endpoint returns an array of IP strings, not objects
  const ipsPromises = vpsList.map(async (vps) => {
    try {
      const ipsResponse = await v6.get<Array<string>>(`/vps/${vps.serviceName}/ips`);
      // Find first IPv4 address (doesn't contain ':' like IPv6 does)
      const ipV4 = ipsResponse.data.find((ip) => typeof ip === 'string' && !ip.includes(':'));
      return { serviceName: vps.serviceName, ipV4: ipV4 || '' };
    } catch {
      return { serviceName: vps.serviceName, ipV4: '' };
    }
  });

  // Fetch service info (expiration date) for each VPS in parallel
  const serviceInfoPromises = vpsList.map(async (vps) => {
    try {
      const serviceInfoResponse = await v6.get<{
        creation: string;
        expiration: string | null;
        renew?: { automatic: boolean; period: string | null };
      }>(`/vps/${vps.serviceName}/serviceInfos`);
      return {
        serviceName: vps.serviceName,
        creationDate: serviceInfoResponse.data.creation,
        expirationDate: serviceInfoResponse.data.expiration,
        autoRenew: serviceInfoResponse.data.renew?.automatic ?? false,
        renewPeriod: serviceInfoResponse.data.renew?.period ?? null,
      };
    } catch {
      return {
        serviceName: vps.serviceName,
        creationDate: '',
        expirationDate: null,
        autoRenew: false,
        renewPeriod: null,
      };
    }
  });

  const [ipsResults, serviceInfoResults] = await Promise.all([
    Promise.all(ipsPromises),
    Promise.all(serviceInfoPromises),
  ]);

  const ipsMap = new Map(ipsResults.map((r) => [r.serviceName, r.ipV4]));
  const serviceInfoMap = new Map(
    serviceInfoResults.map((r) => [r.serviceName, r]),
  );

  // Enrich VPS list with IP addresses and subscription info
  return vpsList.map((vps) => {
    const serviceInfo = serviceInfoMap.get(vps.serviceName);
    return {
      ...vps,
      network: {
        ...vps.network,
        ipV4: ipsMap.get(vps.serviceName) || '',
      },
      subscription: {
        creationDate: serviceInfo?.creationDate || '',
        expirationDate: serviceInfo?.expirationDate || null,
        autoRenew: serviceInfo?.autoRenew || false,
        renewPeriod: serviceInfo?.renewPeriod || null,
      },
    };
  });
};

export const getVpsDetail = async (serviceName: string): Promise<TVps> => {
  const [vpsResponse, ipsResponse, serviceInfoResponse, datacenterResponse] =
    await Promise.all([
      v6.get<TVpsDTO>(`/vps/${serviceName}`),
      v6.get<Array<TVpsIpsDTO>>(`/vps/${serviceName}/ips`),
      v6.get<TVpsServiceInfoDTO>(`/vps/${serviceName}/serviceInfos`),
      v6.get<TVpsDatacenterDTO>(`/vps/${serviceName}/datacenter`),
    ]);

  const distributionResponse = await v6.get<TVpsDistributionDTO>(
    `/vps/${serviceName}/distribution`,
  );

  return mapVpsDtoToEntity({
    vps: vpsResponse.data,
    ips: ipsResponse.data,
    distribution: distributionResponse.data,
    serviceInfo: serviceInfoResponse.data,
    datacenter: datacenterResponse.data,
  });
};

export const getAvailableImages = async (
  serviceName: string,
): Promise<Array<TVpsImage>> => {
  const { data } = await v6.get<Array<TVpsImageDTO>>(
    `/vps/${serviceName}/images/available`,
  );
  return data.map(mapVpsImageDtoToEntity);
};
