import {
  TSshKey,
  TBackupConfiguration,
  TBackupPrice,
  TPrivateNetwork,
  TNetwork,
  TSubnet,
  TFloatingIp,
} from '@/domain/entities/configuration';
import {
  TSshKeyDTO,
  TBackupConfigurationDTO,
  TNetworkDTO,
  TNetworkResourceDTO,
  TSubnetDTO,
  TFloatingIpDTO,
} from './dto.type';

export const mapSshKeyDtoToSshKeyEntity = (
  sshKeysDTO: TSshKeyDTO[],
): TSshKey[] =>
  sshKeysDTO.map(({ name, regions }) => ({
    name,
    regions,
  }));

export const mapBackupConfigurationDtoToEntity = (
  backupConfigurationDTO: TBackupConfigurationDTO,
): TBackupConfiguration[] => {
  const backupModel = backupConfigurationDTO.models.find(
    (model) => model.name === 'instanceBackup',
  );

  if (!backupModel) {
    return [];
  }

  return backupConfigurationDTO.regions.map((region) => {
    const prices: TBackupPrice[] = backupModel.pricings
      .filter(({ regions }) => regions.includes(region.name))
      .map((pricing) => ({
        currencyCode: pricing.price.currencyCode,
        priceInUcents: pricing.price.priceInUcents,
        text: pricing.price.text,
        value: pricing.price.value,
        type: pricing.interval,
      }));

    return {
      region: region.name,
      autoBackupEnabled: region.distantAutoBackupEnabled,
      prices,
    };
  });
};

const mapSubnetDtoToSubnetEntity = (subnet: TSubnetDTO): TSubnet => {
  const capabilities = subnet.capabilities
    .filter((capability) => capability.enabled)
    .map((capability) => capability.type);

  return {
    id: subnet.id,
    cidr: subnet.cidr,
    gatewayIp: subnet.gatewayIp,
    capabilities,
  };
};

const mapNetworkResourceDtoToNetworkEntity = (
  resource: TNetworkResourceDTO,
): TNetwork => ({
  id: resource.id,
  name: resource.name,
  region: resource.region,
  vlanId: resource.vlanId ?? 0,
  subnets: resource.subnets?.map((subnet) => subnet.id) ?? [],
});

const normalizeNetworks = (
  resources: TNetworkResourceDTO[],
): TPrivateNetwork => {
  return resources
    .filter(({ visibility }) => visibility === 'private')
    .reduce<TPrivateNetwork>(
      (acc, resource) => {
        if (!acc.networks.allIds.includes(resource.id))
          acc.networks.allIds.push(resource.id);

        acc.networks.byId.set(
          resource.id,
          mapNetworkResourceDtoToNetworkEntity(resource),
        );

        if (resource.subnets) {
          resource.subnets.reduce((subnetsAcc, subnet) => {
            if (!subnetsAcc.allIds.includes(subnet.id))
              subnetsAcc.allIds.push(subnet.id);

            subnetsAcc.byId.set(subnet.id, mapSubnetDtoToSubnetEntity(subnet));

            return subnetsAcc;
          }, acc.subnets);
        }

        return acc;
      },
      {
        networks: {
          byId: new Map<string, TNetwork>(),
          allIds: [],
        },
        subnets: {
          byId: new Map<string, TSubnet>(),
          allIds: [],
        },
      },
    );
};

export const mapNetworkDtoToPrivateNetworkEntity = (
  dto: TNetworkDTO,
): TPrivateNetwork => normalizeNetworks(dto.resources);

export const mapFloatingIpDtoToEntity = (
  floatingIpsDTO: TFloatingIpDTO[],
): TFloatingIp[] =>
  floatingIpsDTO.map(({ id, ip }: TFloatingIpDTO): TFloatingIp => ({ id, ip }));
