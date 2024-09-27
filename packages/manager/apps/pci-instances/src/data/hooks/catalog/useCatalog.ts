import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { instancesQueryKey } from '@/utils';
import { getCatalog } from '@/data/api/catalog';
import {
  TCatalogDto,
  TCpuDto,
  TDiskDto,
  TGpuDto,
  TMemoryDto,
  TModelDto,
  TPricingDto,
  TSpecificationsDto,
} from '@/types/catalog/api.types';
import {
  TCpu,
  TGpu,
  TMemory,
  TModel,
  TModelEntity,
  TModelPricing,
  TModelSpecification,
  TStorage,
} from '@/types/catalog/entity.types';
import { DeepReadonly } from '@/types/utils.type';

export type TModelSelector = (rawData: TCatalogDto) => TModelEntity;

const getSizeUnit = (size: number) => (size < 1000 ? 'Go' : 'To');

const mapModelCpu = (cpu: TCpuDto): TCpu => {
  const { type, ...rest } = cpu;
  return rest;
};

const mapModelMemory = (memory: TMemoryDto): TMemory => ({
  size: memory.size,
  unit: getSizeUnit(memory.size),
});

const mapModelGpu = ({ model, number }: TGpuDto): TGpu => ({
  model,
  number,
});

const mapModelStorages = (
  storages: DeepReadonly<TDiskDto[]>,
): DeepReadonly<TStorage[]> =>
  storages.map((storage) => ({
    ...storage,
    sizeUnit: getSizeUnit(storage.capacity),
  }));

const mapModelSpecifications = (
  specifications: DeepReadonly<TSpecificationsDto>,
): DeepReadonly<{ specifications: TModelSpecification }> => ({
  specifications: {
    memory: mapModelMemory(specifications.memory),
    cpu: mapModelCpu(specifications.cpu),
    bandwidth: specifications.bandwidth.level,
    storage: mapModelStorages(specifications.storage.disks),
    gpu: mapModelGpu(specifications.gpu),
  },
});

const mapModelPricings = (
  pricings: DeepReadonly<TPricingDto[]>,
): DeepReadonly<{ pricings: TModelPricing[] }> => ({
  pricings: pricings
    .reduce(
      (acc: DeepReadonly<TPricingDto[]>, cur: DeepReadonly<TPricingDto>) => {
        if (!acc.length) return [cur];

        const foundPricingByInterval = acc.find(
          (elt) => elt.interval === cur.interval,
        );

        if (!foundPricingByInterval) return [...acc, cur];
        if (foundPricingByInterval.price < cur.price) return acc;
        return [
          ...acc.filter((elt) => elt.price !== foundPricingByInterval.price),
          cur,
        ];
      },
      [] as TPricingDto[],
    )
    .map(({ regions, osType, ...rest }) => rest),
});

const mapModelsData = (
  models: DeepReadonly<TModelDto[]>,
): DeepReadonly<TModel[]> =>
  models.map(
    ({
      category,
      name,
      isNew,
      compatibleLocalzone,
      compatibleRegion,
      banners,
      pricings,
      specifications,
    }) => ({
      category,
      name,
      isNew,
      compatibleLocalzone,
      compatibleRegion,
      banners,
      ...mapModelPricings(pricings),
      ...mapModelSpecifications(specifications),
    }),
  );

const sortModels = (models: DeepReadonly<TModel[]>) =>
  models
    .slice()
    .sort((a, b) => {
      const aGroup = Number((a.name.match(/[0-9]+/) || [])[0]);
      const bGroup = Number((b.name.match(/[0-9]+/) || [])[0]);
      const aRank = Number((a.name.match(/-([^-]+)$/) || [])[1]);
      const bRank = Number((b.name.match(/-([^-]+)$/) || [])[1]);
      return aGroup === bGroup ? aRank - bRank : bGroup - aGroup;
    })
    .sort(
      (a, b) => Number(b.compatibleLocalzone) - Number(a.compatibleLocalzone),
    )
    .sort((a, b) => Number(b.isNew) - Number(a.isNew));

export const modelSelector: TModelSelector = (rawData) => ({
  models: {
    categories: rawData.categories,
    data: sortModels(mapModelsData(rawData.models)),
  },
});

export const useCatalog = (projectId: string, select: TModelSelector) => {
  const queryKey = useMemo(() => instancesQueryKey(projectId, ['catalog']), [
    projectId,
  ]);
  const fetchCatalog = useCallback(() => getCatalog(projectId), [projectId]);

  return useQuery({
    queryKey,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    queryFn: fetchCatalog,
    placeholderData: keepPreviousData,
    select: useCallback(select, [select]),
  });
};
