import { useMemo } from 'react';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/useImmediateRefetch';
import { getStorages } from '../../api/storage/storages.api';
import { useGetRegions } from '../region/useGetRegions.hook';
import { ObjectStorageTypeEnum, Storages } from '@/types/Storages';

export function useGetStorages(
  projectId: string,
  options?: OptionsFor<typeof getStorages>,
) {
  const regionsQuery = useGetRegions(projectId);
  const queryKey = [projectId, 'storages'];
  const storagesQuery = useQueryImmediateRefetch({
    queryKey,
    queryFn: () =>
      getStorages({
        projectId,
        archive: false,
        withObjects: true,
      }),
    ...options,
  });

  const mappedData = useMemo<Storages | undefined>(() => {
    if (!storagesQuery.data || !regionsQuery.data) return undefined;

    return {
      ...storagesQuery.data,
      resources: storagesQuery.data.resources.map((container) => ({
        ...container,
        regionObj: regionsQuery.data.find(
          (reg) => reg.name === container.region,
        ),
        storageType: container?.s3StorageType
          ? ObjectStorageTypeEnum.s3
          : ObjectStorageTypeEnum.swift,
      })),
    };
  }, [storagesQuery.data, regionsQuery.data]);

  return {
    ...storagesQuery,
    data: mappedData,
  };
}
