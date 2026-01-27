import { TOperationDTO } from '../../operations/right/dto.type';

type TNewSshKeyDTO = {
  name: string;
  publicKey: string;
};

type TExistingSshKeyDTO = {
  name: string;
};

type TNetworkDTO = {
  public: boolean;
};

type TFlavorDTO = {
  id: string;
};

type TBootSourceDTO = {
  imageId: string | null;
  imageRegionName: string | null;
  volumeId: string | null;
};

export type TCreateInstanceDTO = {
  availabilityZone: string | null;
  billingPeriod: 'hourly' | 'monthly';
  bootFrom: TBootSourceDTO;
  bulk: number;
  flavor: TFlavorDTO;
  name: string;
  network: TNetworkDTO;
  sshKey: TExistingSshKeyDTO | null;
  sshKeyCreate: TNewSshKeyDTO | null;
};

export type TCreateInstanceResponseDTO = TOperationDTO & {
  createdAt: string;
  subOperations: TOperationDTO[];
};
