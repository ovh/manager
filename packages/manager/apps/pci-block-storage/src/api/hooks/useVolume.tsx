import { useCallback, useMemo } from 'react';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { getMacroRegion } from '@ovh-ux/manager-react-components';
import {
  useMutation,
  useQueries,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
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
  VolumeOptions,
} from '@/api/data/volume';
import { UCENTS_FACTOR } from '@/hooks/currency-constants';
import queryClient from '@/queryClient';
import { getVolumeCatalogQuery } from '@/api/hooks/useCatalog';
import {
  mapVolumeStatus,
  sortResults,
  paginateResults,
} from '@/api/select/volume';
import { TVolumeCatalog } from '@/api/data/catalog';

export type TVolume = TAPIVolume & {
  statusGroup: string;
  regionName: string;
  canAttachInstance: boolean;
  canDetachInstance: boolean;
};

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
    ]) => {
      const catalogPricing = new Map(
        catalogData?.models.map((m) => [
          m.name,
          new Map(m.pricings.flatMap((p) => p.regions.map((r) => [r, p]))),
        ]),
      );

      return {
        data: data
          ?.map(mapVolumeStatus)
          .map(mapVolumeRegionName)
          .map(
            (volume): TVolume => {
              const pricing = catalogPricing
                .get(volume.type)
                ?.get(volume.region);

              // TODO : update this block when api is up to date
              let maxAttachableInstances = 1;
              if (pricing && pricing.specs.maxAttachableInstances) {
                maxAttachableInstances = pricing.specs.maxAttachableInstances;
              } else if (
                volume.type === 'classic' &&
                volume.region === 'EU-WEST-PAR'
              ) {
                maxAttachableInstances = 16;
              }

              return {
                ...volume,
                canAttachInstance:
                  maxAttachableInstances > volume.attachedTo.length,
                canDetachInstance: volume.attachedTo.length > 0,
              };
            },
          ),
        ...restQuery,
      };
    },
    [mapVolumeRegionName],
  );

  return useQueries({
    queries: [
      {
        queryKey: ['project', projectId, 'volumes'],
        queryFn: () => getAllVolumes(projectId),
        enabled: !!projectId,
      },
      getVolumeCatalogQuery(projectId),
    ],
    combine,
  });
};

export const useVolumes = (
  projectId: string | null,
  { pagination, sorting }: VolumeOptions,
  filters: Filter[] = [],
) => {
  const { data: volumes, error, isLoading, isPending } = useAllVolumes(
    projectId,
  );

  return useMemo(
    () => ({
      isLoading,
      isPending,
      error,
      data: paginateResults<TVolume>(
        sortResults(applyFilters(volumes || [], filters), sorting),
        pagination,
      ),
    }),
    [isLoading, isPending, error, volumes, pagination, sorting, filters],
  );
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

export const useVolume = (projectId: string, volumeId: string) =>
  useQuery({ ...getVolumeQuery(projectId, volumeId) });

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
        ['project', projectId, 'volumes'],
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
        ['project', projectId, 'volumes'],
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

export const useDetachVolume = ({
  projectId,
  volumeId,
  instanceId,
  onError,
  onSuccess,
}: AttachVolumeProps) => {
  const mutation = useMutation({
    mutationFn: async () => detachVolume(projectId, volumeId, instanceId),
    onError,
    onSuccess: (volume: TVolume) => {
      queryClient.setQueryData(
        ['project', projectId, 'volumes'],
        (data: { id: string; attachedTo: string }[]) =>
          data?.map((v) => {
            if (v.attachedTo && v.id === volumeId) {
              return { ...volume, attachedTo: [] };
            }
            return v;
          }),
      );
      queryClient.setQueryData(getVolumeQueryKey(projectId, volumeId), () => ({
        ...volume,
        attachedTo: [],
      }));
      onSuccess(volume);
    },
  });
  return {
    detachVolume: () => mutation.mutate(),
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
        queryKey: ['project', projectId, 'volumes'],
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
        queryKey: ['project', projectId, 'volumes'],
      });
      return onSuccess();
    },
  });

  return {
    addVolume: () => mutation.mutate(),
    ...mutation,
  };
};
