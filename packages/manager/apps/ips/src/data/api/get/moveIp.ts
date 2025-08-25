import { v6, ApiResponse } from '@ovh-ux/manager-core-api';

export type MoveIpDestination = {
  service: string;
  nexthop: string[];
};

export type MoveIpAvailableDestinationsResponse = {
  dedicatedCloud: MoveIpDestination[];
  ipLoadbalancing: MoveIpDestination[];
  vps: MoveIpDestination[];
  hostingReseller: MoveIpDestination[];
  cloudProject: MoveIpDestination[];
  dedicatedServer: MoveIpDestination[];
};

export const getMoveIpAvailableDestinationsQueryKey = (ip: string) => [
  'ip',
  ip,
  'move',
];

export const getMoveIpAvailableDestinations = (
  ip: string,
): Promise<ApiResponse<MoveIpAvailableDestinationsResponse>> =>
  v6.get(`/ip/${encodeURIComponent(ip)}/move`);
