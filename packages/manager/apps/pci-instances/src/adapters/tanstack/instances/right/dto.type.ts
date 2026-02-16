import { TOperationDTO } from '../../operations/right/dto.type';

type TNewSshKeyDTO = {
  name: string;
  publicKey: string;
};

type TExistingSshKeyDTO = {
  name: string;
};

type TSubnetCreateDTO = {
  cidr: string;
  enableDhcp: boolean;
  ipVersion: number;
};

type TNetworkCreateDTO = {
  name: string;
  subnet: TSubnetCreateDTO;
  vlanId: number | null;
};

type TExistingNetworkDTO = {
  id: string;
  subnetId: string;
};

type TGatewayCreateDTO = {
  model: string;
  name: string;
};

type TFloatingIpCreateDTO = {
  description: string;
};

type TExistingFloatingIpDTO = {
  id: string;
};

type TNetworkPrivateDTO = {
  floatingIp: TExistingFloatingIpDTO | null;
  floatingIpCreate: TFloatingIpCreateDTO | null;
  gatewayCreate: TGatewayCreateDTO | null;
  network: TExistingNetworkDTO | null;
  networkCreate: TNetworkCreateDTO | null;
};

type TNetworkDTO = {
  private: TNetworkPrivateDTO;
};

type TFlavorDTO = {
  id: string;
};

type TBootSourceDTO = {
  imageId: string | null;
  imageRegionName: string | null;
  volumeId: string | null;
};

type TAutoBackupDTO = {
  cron: string;
  rotation: number;
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
  autobackup: TAutoBackupDTO | null;
  userData: string | null;
};

export type TCreateInstanceResponseDTO = TOperationDTO & {
  createdAt: string;
  subOperations: TOperationDTO[];
};
