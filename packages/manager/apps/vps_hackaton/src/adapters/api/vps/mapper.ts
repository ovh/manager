import type { TVps, TVpsState, TVpsImage } from '@/domain/entities/vps';
import type {
  TVpsDTO,
  TVpsIpsDTO,
  TVpsDistributionDTO,
  TVpsServiceInfoDTO,
  TVpsDatacenterDTO,
  TVpsImageDTO,
} from './dto.type';

export type TVpsCombinedDTO = {
  vps: TVpsDTO;
  ips: Array<TVpsIpsDTO>;
  distribution: TVpsDistributionDTO;
  serviceInfo: TVpsServiceInfoDTO;
  datacenter: TVpsDatacenterDTO;
};

export const mapVpsDtoToEntity = (dto: TVpsCombinedDTO): TVps => {
  const { vps, ips, distribution, serviceInfo, datacenter } = dto;

  const ipV4 = ips.find((ip) => ip.version === 4)?.ipAddress ?? '';
  const ipV6 = ips.find((ip) => ip.version === 6)?.ipAddress ?? null;

  return {
    serviceName: vps.name,
    displayName: vps.displayName || vps.name,
    state: vps.state as TVpsState,
    model: {
      name: vps.model.name,
      offer: vps.model.offer,
      version: vps.model.version,
      vcore: vps.model.vcore,
      memory: vps.model.memory,
      disk: vps.model.disk,
      maximumAdditionalIp: vps.model.maximumAdditionalIp,
    },
    location: {
      datacenter: datacenter.name,
      country: datacenter.country,
      continent: datacenter.continent,
    },
    network: {
      ipV4,
      ipV6,
      netbootMode: vps.netbootMode as 'local' | 'rescue',
      slaMonitoring: vps.slaMonitoring,
    },
    distribution: {
      id: distribution.id,
      name: distribution.name,
      language: distribution.language,
      available: distribution.available,
    },
    subscription: {
      creationDate: serviceInfo.creation,
      expirationDate: serviceInfo.expiration,
      autoRenew: serviceInfo.renew?.automatic ?? false,
      renewPeriod: serviceInfo.renew?.period ?? null,
    },
    zone: vps.zone,
    cluster: vps.cluster,
    keymap: vps.keymap,
    memoryLimit: vps.memoryLimit,
    offerType: vps.offerType,
    monitoringIpBlocks: vps.monitoringIpBlocks,
  };
};

export const mapVpsListDtoToEntity = (
  serviceNames: Array<string>,
): Array<string> => serviceNames;

export const mapVpsImageDtoToEntity = (dto: TVpsImageDTO): TVpsImage => ({
  id: dto.id,
  name: dto.name,
  type: dto.type as TVpsImage['type'],
  available: dto.available,
  distribution: dto.distribution,
});
