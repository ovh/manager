import { TInstanceCreationData } from '@/domain/entities/instance';
import { TCreateInstanceDTO, TCreateInstanceResponseDTO } from './dto.type';
import { mapDtoStatusToStatus } from '../../operations/right/mapper';

type TCreateInstanceEntity = {
  id: string;
  name: string;
  quantity: number;
  availabilityZone: string | null;
  imageId: string | null;
  imageRegion: string | null;
  existingSshKeyId: string | null;
  newSshPublicKey: string | null;
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
    public: true,
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
  billingPeriod: 'hourly',
});

export const mapDtoToInstanceCreationData = (
  dto: TCreateInstanceResponseDTO,
): TInstanceCreationData => ({
  operationId: dto.id,
  status: mapDtoStatusToStatus(dto.status),
});
