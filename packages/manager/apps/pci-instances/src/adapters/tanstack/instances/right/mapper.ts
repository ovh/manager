import {
  TOperationStatus,
  TInstanceCreationData,
} from '@/domain/entities/instance';
import { TCreateInstanceDTO, TCreateInstanceResponseDTO } from './dto.type';
import { TOperationStatusDTO } from '../../operations/right/dto';

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
  payload: TCreateInstanceEntity,
): TCreateInstanceDTO => ({
  availabilityZone: payload.availabilityZone,
  bootFrom: {
    imageId: payload.imageId,
    imageRegionName: payload.imageRegion,
    volumeId: null,
  },
  bulk: payload.quantity,
  flavor: { id: payload.id },
  name: payload.name,
  network: {
    public: true,
  },
  sshKey: payload.existingSshKeyId ? { name: payload.existingSshKeyId } : null,
  sshKeyCreate:
    payload.newSshPublicKey && payload.existingSshKeyId
      ? {
          name: payload.existingSshKeyId,
          publicKey: payload.newSshPublicKey,
        }
      : null,
  billingPeriod: 'hourly',
});

const mapDtoStatusToStatus = (
  statusDto: TOperationStatusDTO,
): TOperationStatus => {
  switch (statusDto) {
    case 'in-error':
      return 'error';
    case 'in-progress':
      return 'pending';
    default:
      return statusDto;
  }
};

export const mapDtoToInstanceCreationData = (
  dto: TCreateInstanceResponseDTO,
): TInstanceCreationData => ({
  operationId: dto.id,
  status: mapDtoStatusToStatus(dto.status),
});
