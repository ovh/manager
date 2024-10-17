import { useMemo } from 'react';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import {
  useCatalogPrice,
  useTranslatedMicroRegions,
} from '@ovh-ux/manager-react-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useProject } from '@ovh-ux/manager-pci-common';
import { TPricing } from '@/api/data/catalog';
import {
  addVolume,
  AddVolumeProps,
  attachVolume,
  deleteVolume,
  detachVolume,
  getAllVolumes,
  getVolume,
  getVolumeSnapshot,
  paginateResults,
  sortResults,
  TVolume,
  TVolumeSnapshot,
  updateVolume,
  VolumeOptions,
} from '@/api/data/volume';
import { useCatalog } from '@/api/hooks/useCatalog';
import { UCENTS_FACTOR } from '@/hooks/currency-constants';
import queryClient from '@/queryClient';

export const useAllVolumes = (projectId: string) => {
  const { translateMicroRegion } = useTranslatedMicroRegions();
  return useQuery({
    queryKey: ['project', projectId, 'volumes'],
    queryFn: () => getAllVolumes(projectId),
    select: (data) =>
      data.map((volume: TVolume) => {
        let statusGroup = '';
        if (['available', 'in-use'].includes(volume.status)) {
          statusGroup = 'ACTIVE';
        }
        if (
          [
            'creating',
            'attaching',
            'detaching',
            'deleting',
            'backing-up',
            'restoring-backup',
            'snapshotting',
            'awaiting-transfer',
          ].includes(volume.status)
        ) {
          statusGroup = 'PENDING';
        }
        if (
          [
            'error',
            'error_deleting',
            'error_restoring',
            'error_extending',
          ].includes(volume.status)
        ) {
          statusGroup = 'ERROR';
        }
        return {
          ...volume,
          statusGroup,
          regionName: translateMicroRegion(volume.region),
        };
      }),
    enabled: !!projectId,
  });
};

export const useVolumes = (
  projectId: string,
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
  queryFn: (): Promise<TVolume> => getVolume(projectId, volumeId),
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
  volumeToEdit: TVolume;
  originalVolume: TVolume;
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

export const usePriceTransformer = () => {
  const { getFormattedCatalogPrice } = useCatalogPrice();
  return (price: TPricing, currencyCode: string) => ({
    ...price,
    priceInUcents: price.price,
    intervalUnit: price.interval,
    price: {
      currencyCode,
      text: getFormattedCatalogPrice(price.price?.value),
      value: convertUcentsToCurrency(price.price?.value),
    },
  });
};

export const useGetPrices = (projectId: string, volumeId: string) => {
  const { data: project } = useProject(projectId);
  const { data: catalog } = useCatalog();
  const { data: volume } = useVolume(projectId, volumeId);

  const priceFormatter = usePriceTransformer();

  if (project && catalog) {
    const projectPlan = catalog.plans.find(
      (plan) => plan.planCode === project.planCode,
    );

    if (!projectPlan) {
      throw new Error('Fail to get project plan');
    }

    const pricesMap = {};

    projectPlan.addonFamilies.forEach((family) => {
      family.addons.forEach((planCode) => {
        const addon = catalog.addons.find(
          (addonCatalog) => addonCatalog.planCode === planCode,
        );

        const pricing =
          addon?.pricings.find(
            ({ capacities }) =>
              capacities.includes('renew') ||
              capacities.includes('consumption'),
          ) || ({} as TPricing);

        pricesMap[planCode] = priceFormatter(
          pricing as TPricing,
          catalog.locale.currencyCode,
        );
      });
    });

    if (volume) {
      const relatedCatalog =
        pricesMap[`volume.${volume.type}.consumption.${volume.region}`] ||
        pricesMap[`volume.${volume.type}.consumption`];

      return relatedCatalog;
    }
  }

  return {};
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
