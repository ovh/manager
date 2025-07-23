import { fetchIcebergV2, v2 } from '@ovh-ux/manager-core-api';

import { getApiPath } from '@/data/api';
import { APIV2_DEFAULT_PAGESIZE } from '@/utils';

import { SlotType } from './type';

// GET

export const getZimbraPlatformSlots = ({
  platformId,
  searchParams,
  pageParam,
  pageSize = APIV2_DEFAULT_PAGESIZE,
}: {
  platformId: string;
  searchParams?: string;
  pageParam?: unknown;
  pageSize?: number;
}) =>
  fetchIcebergV2<SlotType[]>({
    route: `${getApiPath(platformId)}slot${searchParams}`,
    pageSize,
    cursor: pageParam as string,
  });

export const getZimbraPlatformSlot = async (platformId: string, slotId: string) => {
  const { data } = await v2.get<SlotType>(`${getApiPath(platformId)}slot/${slotId}`);
  return data;
};
