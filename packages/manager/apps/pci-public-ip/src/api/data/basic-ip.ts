import { fetchIcebergV2, v2 } from '@ovh-ux/manager-core-api';

const INSTANCE_RESOURCE_TYPE = 'instance';

const LISTING_PAGE_SIZE = 500;

export type TBasicIpLocation = {
  region: string;
  availabilityZone?: string;
};

export type TBasicIpAssociatedResource = {
  id: string;
  type: string;
};

export type TBasicIpTaskStatus =
  | 'ERROR'
  | 'PENDING'
  | 'RUNNING'
  | 'SCHEDULED'
  | 'WAITING_USER_INPUT'
  | null;

export type TBasicIpTask = {
  id: string;
  link: string;
  status: TBasicIpTaskStatus;
  type: string;
};

export type TBasicIpResourceStatus =
  | 'CREATING'
  | 'DELETING'
  | 'ERROR'
  | 'OUT_OF_SYNC'
  | 'READY'
  | 'SUSPENDED'
  | 'UNKNOWN'
  | 'UPDATING';

export type TBasicIp = {
  checksum: string;
  createdAt: string;
  updatedAt: string;
  /** The Ext-Net IP address, used as identifier */
  id: string;
  resourceStatus: TBasicIpResourceStatus;
  currentState: {
    associatedResource: TBasicIpAssociatedResource | null;
    id: string | null;
    ip: string;
    location: TBasicIpLocation;
  };
  currentTasks: TBasicIpTask[];
  targetSpec: {
    location: TBasicIpLocation;
  };
};

export type TBasicIpOrder = {
  projectId: string;
  regionName: string;
  availabilityZone?: string;
  instanceId?: string;
};

export const getBasicIpUrl = (projectId: string) =>
  `/publicCloud/project/${projectId}/publicIp/extNet`;

export const getAllBasicIp = async (projectId: string): Promise<TBasicIp[]> => {
  const basicIps: TBasicIp[] = [];

  const fetchPage = async (cursor: string | null): Promise<void> => {
    const { data, cursorNext } = await fetchIcebergV2<TBasicIp>({
      route: getBasicIpUrl(projectId),
      pageSize: LISTING_PAGE_SIZE,
      cursor,
    });

    basicIps.push(...data);

    if (cursorNext) {
      await fetchPage(cursorNext);
    }
  };

  await fetchPage(null);

  return basicIps;
};

export const terminateBasicIp = async (projectId: string, id: string) => {
  const { data } = await v2.delete<TBasicIp>(
    `${getBasicIpUrl(projectId)}/${id}`,
  );
  return data;
};

export const createBasicIp = ({
  projectId,
  regionName,
  availabilityZone,
  instanceId,
}: TBasicIpOrder): Promise<TBasicIp> =>
  v2
    .post<TBasicIp>(getBasicIpUrl(projectId), {
      targetSpec: {
        location: {
          region: regionName,
          ...(availabilityZone && { availabilityZone }),
        },
        // Attaching at creation is not exposed by the API yet. The field mirrors
        // currentState.associatedResource and is sent on the assumption that
        // creation and association will share this call.
        ...(instanceId && {
          associatedResource: {
            id: instanceId,
            type: INSTANCE_RESOURCE_TYPE,
          },
        }),
      },
    })
    .then(({ data }) => data);
