import { useCallback, useMemo } from 'react';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import {
  ColumnSort,
  PaginationState,
  useCatalogPrice,
} from '@ovh-ux/manager-react-components';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { pipe } from 'lodash/fp';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  addVolume,
  attachVolume,
  deleteVolume,
  detachVolume,
  getAllVolumes,
  getVolume,
  getVolumeSnapshot,
  TAPIVolume,
  TVolumeSnapshot,
  updateVolume,
} from '@/api/data/volume';
import { UCENTS_FACTOR } from '@/hooks/currency-constants';
import queryClient from '@/queryClient';
import {
  getVolumeCatalogQuery,
  useVolumeCatalog,
} from '@/api/hooks/useCatalog';
import {
  mapVolumeAttach,
  mapVolumeEncryption,
  mapVolumePricing,
  mapVolumeRegion,
  mapVolumeStatus,
  mapVolumeToAdd,
  mapVolumeToEdit,
  mapVolumeType,
  paginateResults,
  sortResults,
  TVolumeAttach,
  TVolumeEncryption,
  TVolumePricing,
  TVolumeRegion,
  TVolumeStatus,
  TVolumeToAdd,
  TVolumeType,
} from '@/api/select/volume';

export type TVolume = TAPIVolume &
  TVolumeAttach &
  TVolumeEncryption &
  TVolumeStatus &
  TVolumeType & {
    regionName: string;
  };

export const getVolumesQueryKey = (projectId: string | null) => [
  'project',
  projectId,
  'volumes',
];

export const useAllVolumes = (projectId: string | null) => {
  const { t } = useTranslation(['region', 'common']);

  const [{ data, ...restQuery }, { data: catalogData }] = useQueries({
    queries: [
      {
        queryKey: getVolumesQueryKey(projectId),
        queryFn: () => getAllVolumes(projectId),
        enabled: !!projectId,
      },
      getVolumeCatalogQuery(projectId),
    ],
  });

  const select = useMemo(
    () =>
      pipe(
        mapVolumeStatus(t),
        mapVolumeRegion(t),
        mapVolumeAttach(catalogData),
        mapVolumeEncryption(t, catalogData),
        mapVolumeType(catalogData),
      ),
    [t, catalogData],
  );

  return {
    data: useMemo(() => data?.map<TVolume>(select), [data, select]),
    ...restQuery,
  };
};

export type VolumeOptions = {
  pagination: PaginationState;
  sorting: ColumnSort;
};

export const useVolumes = (
  projectId: string | null,
  { pagination, sorting }: VolumeOptions,
  filters: Filter[] = [],
) => {
  const { data: volumes, ...restQuery } = useAllVolumes(projectId);

  return {
    data: useMemo(
      () =>
        paginateResults<TVolume>(
          sortResults(applyFilters(volumes || [], filters), sorting),
          pagination,
        ),
      [volumes, filters, sorting, pagination],
    ),
    ...restQuery,
  };
};

export const getVolumeQueryKey = (projectId: string, volumeId: string) => [
  'volume',
  projectId,
  volumeId,
];

export const getVolumeQuery = (projectId: string, volumeId: string) => ({
  queryKey: getVolumeQueryKey(projectId, volumeId),
  queryFn: () => getVolume(projectId, volumeId),
  enabled: !!volumeId,
});

export type UseVolumeResult =
  | (TAPIVolume &
      TVolumeAttach &
      TVolumeEncryption &
      TVolumeStatus &
      TVolumeRegion &
      TVolumePricing)
  | undefined;

export const useVolume = (
  projectId: string,
  volumeId: string,
  capacity?: number,
) => {
  const [{ data, ...restQuery }, { data: catalogData }] = useQueries({
    queries: [
      getVolumeQuery(projectId, volumeId),
      getVolumeCatalogQuery(projectId),
    ],
  });
  const { t } = useTranslation(['common', 'add', NAMESPACES.BYTES]);
  const { getFormattedCatalogPrice } = useCatalogPrice(6, {
    hideTaxLabel: true,
  });

  const select = useMemo(
    () =>
      pipe(
        mapVolumeAttach(catalogData),
        mapVolumeEncryption(t, catalogData),
        mapVolumeStatus(t),
        mapVolumeRegion(t),
        mapVolumePricing(catalogData, getFormattedCatalogPrice, t, capacity),
      ),
    [catalogData, t, getFormattedCatalogPrice, capacity],
  );

  return {
    data: useMemo<UseVolumeResult>(() => (data ? select(data) : undefined), [
      select,
      data,
    ]),
    ...restQuery,
  };
};

export const getVolumeSnapshotQueryKey = (projectId: string) => [
  'volume-snapshot',
  projectId,
];

export const useVolumeSnapshot = (projectId: string) =>
  useQuery({
    queryKey: ['volume-snapshot', projectId],
    queryFn: (): Promise<TVolumeSnapshot[]> => getVolumeSnapshot(projectId),
  });

interface DeleteVolumeProps {
  projectId: string;
  volumeId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export const useDeleteVolume = ({
  projectId,
  volumeId,
  onError,
  onSuccess,
}: DeleteVolumeProps) => {
  const mutation = useMutation({
    mutationFn: async () => deleteVolume(projectId, volumeId),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getVolumeQueryKey(projectId, volumeId),
      });
      queryClient.setQueryData(
        getVolumesQueryKey(projectId),
        (data: { id: string }[]) => data?.filter((v) => v.id !== volumeId),
      );
      onSuccess();
    },
  });
  return {
    deleteVolume: () => mutation.mutate(),
    ...mutation,
  };
};

interface AttachVolumeProps {
  projectId: string;
  volumeId: string;
  instanceId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export const useAttachVolume = ({
  projectId,
  volumeId,
  instanceId,
  onError,
  onSuccess,
}: AttachVolumeProps) => {
  const mutation = useMutation({
    mutationFn: async () => attachVolume(projectId, volumeId, instanceId),
    onError,
    onSuccess: (volume) => {
      queryClient.setQueryData(
        getVolumesQueryKey(projectId),
        (data: { id: string }[]) =>
          data?.map((v) =>
            v.id === volumeId ? { ...volume, attachedTo: [instanceId] } : v,
          ),
      );
      queryClient.setQueryData(getVolumeQueryKey(projectId, volumeId), () => ({
        ...volume,
        attachedTo: [instanceId],
      }));
      onSuccess();
    },
  });
  return {
    attachVolume: () => mutation.mutate(),
    ...mutation,
  };
};

interface DetachParams {
  projectId: string;
  volumeId: string;
  instanceId: string;
}

export const useDetachVolume = (options?: {
  onSuccess: () => void;
  onError: (error: Error) => void;
}) => {
  const { onSuccess, onError } = options || {};

  const mutation = useMutation({
    mutationFn: async ({ projectId, volumeId, instanceId }: DetachParams) =>
      detachVolume(projectId, volumeId, instanceId),
    onError,
    onSuccess: (volume, { projectId, instanceId, volumeId }) => {
      const newVolume = {
        ...volume,
        attachedTo: volume.attachedTo.filter((id) => id !== instanceId),
      };
      queryClient.setQueryData(
        getVolumesQueryKey(projectId),
        (data: { id: string; attachedTo: string }[] | undefined) =>
          data?.map((v) => {
            if (v.id === volumeId) {
              return newVolume;
            }
            return v;
          }),
      );
      queryClient.setQueryData(
        getVolumeQueryKey(projectId, volumeId),
        () => newVolume,
      );
      onSuccess();
    },
  });
  return {
    detachVolume: mutation.mutate,
    ...mutation,
  };
};

export const convertUcentsToCurrency = (value: number, interval = 1) =>
  value / interval / UCENTS_FACTOR;

interface UpdateVolumeProps {
  projectId: string;
  volumeToEdit: Pick<TVolume, 'name' | 'size' | 'bootable'>;
  originalVolume: UseVolumeResult;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export const useUpdateVolume = ({
  projectId,
  volumeToEdit,
  originalVolume,
  onError,
  onSuccess,
}: UpdateVolumeProps) => {
  const mutation = useMutation({
    mutationFn: () =>
      updateVolume(
        mapVolumeToEdit({ projectId, originalVolume, volumeToEdit }),
      ),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getVolumeQueryKey(projectId, originalVolume.id),
      });
      await queryClient.invalidateQueries({
        queryKey: getVolumesQueryKey(projectId),
      });
      onSuccess();
    },
  });
  return {
    updateVolume: () => mutation.mutate(),
    ...mutation,
  };
};

type UseAddVolumeProps = {
  projectId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useAddVolume = ({
  projectId,
  onError,
  onSuccess,
}: UseAddVolumeProps) => {
  const { data: catalog } = useVolumeCatalog(projectId);

  const mutationFn = useCallback<(volumeToAdd: TVolumeToAdd) => Promise<void>>(
    (volumeToAdd) =>
      catalog
        ? addVolume(mapVolumeToAdd(projectId, catalog)(volumeToAdd))
        : Promise.reject(),
    [catalog, projectId],
  );

  const mutation = useMutation({
    mutationFn,
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getVolumesQueryKey(projectId),
      });
      return onSuccess();
    },
  });

  return {
    addVolume: mutation.mutate,
    ...mutation,
  };
};
