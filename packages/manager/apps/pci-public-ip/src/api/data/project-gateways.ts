import { fetchIcebergV2 } from '@ovh-ux/manager-core-api';

const LISTING_PAGE_SIZE = 500;

export type TProjectGatewayStatus = 'ACTIVE' | 'BUILD' | 'DOWN' | 'ERROR';

export type TProjectGatewayResourceStatus =
  | 'CREATING'
  | 'DELETING'
  | 'ERROR'
  | 'OUT_OF_SYNC'
  | 'READY'
  | 'SUSPENDED'
  | 'UNKNOWN'
  | 'UPDATING';

export type TProjectGatewayLocation = {
  region: string;
  availabilityZone?: string;
};

/**
 * Project-wide gateway, as returned by the v2 listing. Only the fields consumed
 * here are modelled; the API also returns subnets, external gateway details and
 * running tasks.
 */
export type TProjectGateway = {
  checksum: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  resourceStatus: TProjectGatewayResourceStatus;
  /** Null until the gateway exists on the OpenStack side */
  currentState: {
    description: string | null;
    externalIp: string | null;
    location: TProjectGatewayLocation;
    name: string;
    status: TProjectGatewayStatus;
  } | null;
  targetSpec: {
    description: string | null;
    location: TProjectGatewayLocation;
    name: string;
  };
};

export const getProjectGatewaysUrl = (projectId: string) =>
  `/publicCloud/project/${projectId}/gateway`;

export const getAllProjectGateways = async (
  projectId: string,
): Promise<TProjectGateway[]> => {
  const gateways: TProjectGateway[] = [];

  const fetchPage = async (cursor: string | null): Promise<void> => {
    const { data, cursorNext } = await fetchIcebergV2<TProjectGateway>({
      route: getProjectGatewaysUrl(projectId),
      pageSize: LISTING_PAGE_SIZE,
      cursor,
    });

    gateways.push(...data);

    if (cursorNext) {
      await fetchPage(cursorNext);
    }
  };

  await fetchPage(null);

  return gateways;
};

/** A gateway is named by its target spec until OpenStack reports its state */
export const getProjectGatewayName = (gateway: TProjectGateway) =>
  gateway.currentState?.name ?? gateway.targetSpec?.name ?? '';
