import { useCallback, useMemo } from 'react';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import {
  ColumnSort,
  getMacroRegion,
  PaginationState,
} from '@ovh-ux/manager-react-components';
import {
  useMutation,
  useQueries,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { pipe } from 'lodash/fp';
import {
  addVolume,
  AddVolumeProps,
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
import { getVolumeCatalogQuery } from '@/api/hooks/useCatalog';
import {
  mapVolumeStatus,
  sortResults,
  paginateResults,
  mapVolumeAttach,
  WithAttach,
} from '@/api/select/volume';
import { TVolumeCatalog } from '@/api/data/catalog';

export type TVolume = WithAttach<
  TAPIVolume & {
    statusGroup: string;
    regionName: string;
  }
>;

export const getVolumesQueryKey = (projectId: string | null) => [
  'project',
  projectId,
  'volumes',
];

export const useAllVolumes = (projectId: string | null) => {
  const { t } = useTranslation('region');

  const mapVolumeRegionName = useCallback(
    <V extends TAPIVolume>(volume: V): V & { regionName: string } => ({
      ...volume,
      regionName: t(
        `manager_components_region_${getMacroRegion(volume.region)}_micro`,
        {
          micro:
            volume.availabilityZone && volume.availabilityZone !== 'any'
              ? volume.availabilityZone
              : volume.region,
        },
      ),
    }),
    [t],
  );

  const combine = useCallback(
    ([{ data, ...restQuery }, { data: catalogData }]: [
      UseQueryResult<TAPIVolume[]>,
      UseQueryResult<TVolumeCatalog>,
    ]) => ({
      data: data?.map(
        pipe(
          mapVolumeStatus,
          mapVolumeRegionName,
          mapVolumeAttach(catalogData),
        ),
      ),
      ...restQuery,
    }),
    [mapVolumeRegionName],
  );

  return useQueries({
    queries: [
      {
        queryKey: getVolumesQueryKey(projectId),
        queryFn: () => getAllVolumes(projectId),
        enabled: !!projectId,
      },
      getVolumeCatalogQuery(projectId),
    ],
    combine,
  });
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

export type UseVolumeResult = WithAttach<TAPIVolume>;

export const useVolume = (projectId: string, volumeId: string) =>
  useQueries({
    queries: [
      getVolumeQuery(projectId, volumeId),
      getVolumeCatalogQuery(projectId),
    ],
    combine: ([{ data, ...restQuery }, { data: catalogData }]) => {
      const mapAttach = mapVolumeAttach(catalogData);

      return {
        data: data ? mapAttach(data) : undefined,
        ...restQuery,
      };
    },
  });

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
  onSuccess: (volume: TVolume) => void;
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
    onSuccess: (volume: TVolume) => {
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
      onSuccess(volume);
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
    onSuccess: (volume: TVolume, { projectId, instanceId, volumeId }) => {
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
  volumeToEdit: Partial<TAPIVolume>;
  originalVolume: TAPIVolume;
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
    mutationFn: async () =>
      updateVolume(projectId, volumeToEdit, originalVolume),
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

type UseAddVolumeProps = AddVolumeProps & {
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useAddVolume = ({
  name,
  projectId,
  regionName,
  volumeCapacity,
  volumeType,
  availabilityZone,
  onError,
  onSuccess,
}: UseAddVolumeProps) => {
  const mutation = useMutation({
    mutationFn: async () =>
      addVolume({
        name,
        projectId,
        regionName,
        volumeCapacity,
        volumeType,
        availabilityZone,
      }),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getVolumesQueryKey(projectId),
      });
      return onSuccess();
    },
  });

  return {
    addVolume: () => mutation.mutate(),
    ...mutation,
  };
};
