import { TInstance } from '@ovh-ux/manager-pci-common';

export type TWorkflowInstance = TInstance & {
  statusGroup?: string;
  regionName?: string;
  flavorName?: string;
};
