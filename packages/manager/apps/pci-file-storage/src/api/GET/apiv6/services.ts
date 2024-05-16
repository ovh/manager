import { fetchIcebergV6, apiClient } from '@ovh-ux/manager-core-api';

enum ShareStatus {
  Available = 'available',
}

enum ShareProtocol {
  NFS = 'nfs',
}

type ShareCapability = {
  name: string;
  enabled: boolean;
};

type Share = {
  capabilities: ShareCapability[];
  createdAt: Date;
  description: string;
  id: string;
  isPublic: boolean;
  name: string;
  protocol: ShareProtocol;
  region: string;
  size: number;
  status: ShareStatus;
  updatedAt: Date;
};

function transformShare(share: Share): Share {
  return {
    ...share,
    createdAt: new Date(share.createdAt),
    updatedAt: new Date(share.updatedAt),
  };
}

export const getShare = async ({
  serviceName,
  regionName,
  id,
}: {
  serviceName: string;
  regionName: string;
  id: string;
}): Promise<Share> => {
  const { data: shareObject } = await apiClient.v6.get<Share>(
    `/cloud/project/${serviceName}/region/${regionName}/share/${id}`,
  );
  return transformShare(shareObject);
};

/**
 *  Get listing with iceberg V6
 */
export const getShares = async ({
  projectId,
  pageSize,
  page,
}: {
  projectId: string;
  pageSize: number;
  page: number;
}): Promise<{ data: Share[]; status: number; totalCount: number }> => {
  try {
    const { data: wrongData, status, totalCount } = await fetchIcebergV6<Share>(
      {
        route: `/cloud/project/${projectId}/aggregated/share`,
        pageSize,
        page,
      },
    );
    const shares = (wrongData[0] as unknown) as Share[];
    return {
      data: shares.map(transformShare),
      status,
      totalCount: totalCount - 1,
    };
  } catch (error) {
    return null;
  }
};
