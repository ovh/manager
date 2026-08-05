import { TBasicIpResourceStatus } from '@/api/data/basic-ip';

/**
 * Resource kinds a basic IP can be attached to. Values are compared against the
 * API discriminator lowercased, so the casing it sends does not matter.
 */
export const BASIC_IP_RESOURCE_TYPE = {
  INSTANCE: 'instance',
  GATEWAY: 'gateway',
} as const;

export type TIpVersion = 4 | 6;

/**
 * One extNet address. The IPv4 and IPv6 of a dual-stack basic IP are listed, and
 * deleted, independently of each other, so each gets its own row.
 */
export type TBasicIpRow = {
  id: string;
  ip: string;
  ipVersion: TIpVersion;
  region: string;
  associatedResourceId: string;
  /** Lowercased API discriminator, empty when nothing is attached */
  associatedResourceType: string;
  associatedResourceName: string;
  isAttached: boolean;
  status: TBasicIpResourceStatus;
  search: string;
};

export enum PublicIp {
  FAILOVER = 'failover_ip',
  FLOATING = 'floating_ip',
  BASIC = 'basic_ip',
}
