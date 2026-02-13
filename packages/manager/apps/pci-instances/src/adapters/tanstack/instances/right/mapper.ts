import { TInstanceCreationData } from '@/domain/entities/instance';
import { TCreateInstanceDTO, TCreateInstanceResponseDTO } from './dto.type';
import { mapDtoStatusToStatus } from '../../operations/right/mapper';

type TNewPrivateNetwork = {
  name: string;
  vlanId: number;
  cidr: string;
  enableDhcp: boolean;
};

type TInstancePrivateNetworkData = {
  existingFloatingIpId: string | null;
  floatingIpAssignment: 'createNew' | 'reuseExisting' | null;
  assignNewGateway: boolean;
  networkId: string | null;
  subnetId: string | null;
  newPrivateNetwork: TNewPrivateNetwork | null;
};

type TCreateInstanceEntity = {
  id: string;
  name: string;
  quantity: number;
  availabilityZone: string | null;
  imageId: string | null;
  imageRegion: string | null;
  existingSshKeyId: string | null;
  newSshPublicKey: string | null;
  localBackupRotation: string | null;
  billingPeriod: 'hourly' | 'monthly';
  postInstallScript: string | null;
} & TInstancePrivateNetworkData;

export const mapPrivateNetworkToDTO = ({
  existingFloatingIpId,
  floatingIpAssignment,
  assignNewGateway,
  networkId,
  subnetId,
  newPrivateNetwork,
}: TInstancePrivateNetworkData) => {
  const floatingIp =
    floatingIpAssignment === 'reuseExisting' && existingFloatingIpId
      ? { id: existingFloatingIpId }
      : null;

  const floatingIpCreate =
    floatingIpAssignment === 'createNew' ? { description: '' } : null;

  const gatewayCreate = assignNewGateway ? { model: 's', name: '' } : null;

  const network =
    !!networkId && !!subnetId ? { id: networkId, subnetId } : null;

  const networkCreate =
    !network && !!newPrivateNetwork
      ? {
          name: newPrivateNetwork.name,
          vlanId: newPrivateNetwork.vlanId,
          subnet: {
            cidr: newPrivateNetwork.cidr,
            enableDhcp: newPrivateNetwork.enableDhcp,
            ipVersion: 4,
          },
        }
      : null;

  return {
    floatingIp,
    floatingIpCreate,
    gatewayCreate,
    network,
    networkCreate,
  };
};

export const mapFlavorToDTO = (
  entity: TCreateInstanceEntity,
): TCreateInstanceDTO => ({
  availabilityZone: entity.availabilityZone,
  bootFrom: {
    imageId: entity.imageId,
    imageRegionName: entity.imageRegion,
    volumeId: null,
  },
  bulk: entity.quantity,
  flavor: { id: entity.id },
  name: entity.name,
  network: {
    private: mapPrivateNetworkToDTO({
      existingFloatingIpId: entity.existingFloatingIpId,
      floatingIpAssignment: entity.floatingIpAssignment,
      assignNewGateway: entity.assignNewGateway,
      networkId: entity.networkId,
      subnetId: entity.subnetId,
      newPrivateNetwork: entity.newPrivateNetwork,
    }),
  },
  sshKey:
    entity.existingSshKeyId && !entity.newSshPublicKey
      ? { name: entity.existingSshKeyId }
      : null,
  sshKeyCreate:
    entity.existingSshKeyId && entity.newSshPublicKey
      ? {
          name: entity.existingSshKeyId,
          publicKey: entity.newSshPublicKey,
        }
      : null,
  billingPeriod: entity.billingPeriod,
  autobackup: entity.localBackupRotation
    ? {
        cron: `0 0 */${entity.localBackupRotation} * *`,
        rotation: Number(entity.localBackupRotation),
      }
    : null,
  userData: entity.postInstallScript ?? null,
});

export const mapDtoToInstanceCreationData = (
  dto: TCreateInstanceResponseDTO,
): TInstanceCreationData => ({
  operationId: dto.id,
  status: mapDtoStatusToStatus(dto.status),
});
