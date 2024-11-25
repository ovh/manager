import { z } from 'zod';
import { NEW_PRIVATE_NETWORK_FORM_SCHEMA } from '@/pages/new/new.constants';
import { IP_ALLOCATION_SCHEMA } from '@/pages/new/subnet/advanced/ipAllocation/ipAllocation.constant';

export type Subnet = {
  cidr: string;
  enableDhcp: boolean;
  enableGatewayIp: boolean;
  ipVersion: number;
};

export type Gateway = {
  model: string;
  name: string;
};

export type NewPrivateNetworkForm = z.infer<
  typeof NEW_PRIVATE_NETWORK_FORM_SCHEMA
>;

export type IpAllocationForm = z.infer<typeof IP_ALLOCATION_SCHEMA>;
