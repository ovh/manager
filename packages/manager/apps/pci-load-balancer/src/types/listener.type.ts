import { TInstance } from '@ovh-ux/manager-pci-common';

export interface ListenerConfiguration {
  protocol: string;
  port: number;
  healthMonitor: string;
  instances: {
    instance: TInstance;
    port: number;
  }[];
}
