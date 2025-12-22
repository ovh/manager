import ipaddr from 'ipaddr.js';
import { VCDVrackSegment } from '@ovh-ux/manager-module-vcd-api';

/**
 * Returns true if the given CIDR belongs to a private (non-routable) range.
 */
export function isPrivateNetwork(cidr: string): boolean {
  const [ip] = cidr.split('/');
  return ipaddr.parse(ip).range() === 'private';
}

/**
 * Counts how many public IP blocks are registered on the UNTAGGED vRack segment.
 */
export function getPublicIpBlockCount(segments: VCDVrackSegment[]): number {
  const untagged = segments.find((s) => s.currentState?.mode === 'UNTAGGED');
  if (!untagged) return 0;

  const networks = untagged.currentState?.networks || [];

  const publicNetworks = networks.filter((cidr) => !isPrivateNetwork(cidr));

  return publicNetworks.length;
}
