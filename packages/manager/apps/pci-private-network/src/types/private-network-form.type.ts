import { z } from 'zod';
import { NEW_PRIVATE_NETWORK_FORM_SCHEMA } from '@/pages/new/new.constants';

export type Subnet = {
  cidr: string;
  enableDhcp: boolean;
  enableGatewayIp: boolean;
  ipVersion: number;
  dnsNameServers: [];
  useDefaultPublicDNSResolver: boolean;
};

export type Gateway = {
  model: string;
  name: string;
};

export type NewPrivateNetworkForm = z.infer<
  typeof NEW_PRIVATE_NETWORK_FORM_SCHEMA
>;
