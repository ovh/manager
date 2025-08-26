import { convertHourlyPriceToMonthly } from '@ovh-ux/manager-react-components';
import { TFunction } from 'i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { pipe } from 'lodash/fp';
import {
  TCatalogGroup,
  TVolumeAddon,
  TVolumeCatalog,
  TVolumePricing,
} from '@/api/data/catalog';
import { TRegion } from '@/api/data/regions';
import { EncryptionType } from '@/api/select/volume';
import { TAPIVolume } from '@/api/data/volume';
import { TVolumeModel } from '@/api/hooks/useCatalog';
import { TVolumeRetypeModel } from '@/api/hooks/useCatalogWithPreselection';

export type TModelName = Readonly<{
  name: Opaque<string, TModelName>;
  displayName: Opaque<string, TModelName>;
}>;

type TVolumeModelWithName<T extends TVolumeAddon> = T & TModelName;

export const mapVolumeModelName = <T extends TVolumeAddon>(
  catalogRegions: TVolumeCatalog['regions'],
  region: string,
) => {
  const is3azRegion =
    catalogRegions.find((r) => r.name === region).type === 'region-3-az';

  return (model: T): TVolumeModelWithName<T> => ({
    ...model,
    name: model.name as TModelName['name'],
    displayName: (is3azRegion && model.name === 'classic-multiattach'
      ? 'Classic 3AZ'
      : model.name) as TModelName['displayName'],
  });
};

export type TModelAvailabilityZones = {
  availabilityZonesCount: number | null;
  showAvailabilityZones: boolean;
};

export const getAvailabilityZonesFromModelPricings = (
  pricings: TVolumeAddon['pricings'],
  is3azRegion: boolean | null,
): TModelAvailabilityZones => {
  const pricing = pricings[0];

  let availabilityZonesCount: TModelAvailabilityZones['availabilityZonesCount'] = null;
  if (is3azRegion) {
    availabilityZonesCount = pricing.showAvailabilityZones ? 1 : 3;
  }

  return {
    availabilityZonesCount,
    showAvailabilityZones: pricing.showAvailabilityZones,
  };
};

export type TModelPrice = {
  hourlyPrice: {
    value: string;
    unit: string;
    isLeastPrice: boolean;
  };
  monthlyPrice: {
    value: string;
    unit: string;
    isLeastPrice: boolean;
  };
  iops: string;
  areIOPSDynamic: boolean;
  bandwidth: string | null;
  isBandwidthDynamic: boolean;
  encrypted: boolean;
  capacity: {
    // in bytes
    max: number;
  };
  technicalName: string;
};

const formatSecondUnit = (value: string | number) => `${value}/s`;

export const getPricingSpecsFromModelPricings = (
  pricings: TVolumeAddon['pricings'],
  formatCatalogPrice: (price: number) => string,
  t: TFunction<['add', 'common', typeof NAMESPACES.BYTES]>,
  capacity?: number,
): TModelPrice => {
  const pricing = pricings[0];

  let iops = `${Math.min(
    (capacity ?? 1) * pricing.specs.volume.iops.level,
    pricing.specs.volume.iops.max,
  )} IOPS`;
  if (pricing.areIOPSDynamic && capacity === undefined) {
    iops += [
      `/${t(`${NAMESPACES.BYTES}:unit_size_GB`)}`,
      `${t('common:pci_projects_project_storages_blocks_up_to')} ${
        pricing.specs.volume.iops.max
      } IOPS`,
    ].join(', ');
  } else if (pricing.specs.volume.iops.guaranteed) {
    iops += ` ${t('common:pci_projects_project_storages_blocks_guaranteed')}`;
  } else if (!pricing.areIOPSDynamic && !pricing.specs.volume.iops.guaranteed) {
    iops = `${t('common:pci_projects_project_storages_blocks_up_to')} ${iops}`;
  }

  let bandwidth: TModelPrice['bandwidth'] = null;

  if (pricing.specs.bandwidth) {
    const level = formatSecondUnit(
      `${Math.min(
        (capacity ?? 1) * pricing.specs.bandwidth.level,
        pricing.specs.bandwidth.max * 10 ** 3,
      )} ${t(`${NAMESPACES.BYTES}:unit_size_MB`)}`,
    );

    if (pricing.isBandwidthDynamic) {
      if (typeof capacity === 'number') {
        bandwidth = level;
      } else {
        const max = formatSecondUnit(
          `${pricing.specs.bandwidth.max} ${t(
            `${NAMESPACES.BYTES}:unit_size_GB`,
          )}`,
        );

        bandwidth = [
          [level, t(`${NAMESPACES.BYTES}:unit_size_GB`)].join('/'),
          `${t('common:pci_projects_project_storages_blocks_up_to')} ${max}`,
        ].join(', ');
      }
    } else if (pricing.specs.bandwidth?.guaranteed) {
      bandwidth = `${level} ${t(
        'common:pci_projects_project_storages_blocks_guaranteed',
      )}`;
    }
  }

  return {
    hourlyPrice: {
      value: formatCatalogPrice(pricing.price * (capacity ?? 1)),
      isLeastPrice: false,
      unit: t('add:pci_projects_project_storages_blocks_add_type_addon_price', {
        price: '',
      }).trim(),
    },
    monthlyPrice: {
      value: formatCatalogPrice(
        convertHourlyPriceToMonthly(pricing.price * (capacity ?? 1)),
      ),
      isLeastPrice: false,
      unit: t('add:pci_projects_project_storages_blocks_add_type_price', {
        price: '',
      }).trim(),
    },
    iops,
    areIOPSDynamic: pricing.areIOPSDynamic,
    bandwidth,
    isBandwidthDynamic: pricing.isBandwidthDynamic,
    encrypted: pricings.some((p) => p.specs.encrypted),
    capacity: {
      max: pricing.specs.volume.capacity.max * 10 ** 9,
    },
    technicalName: pricing.specs.name,
  };
};

type TVolumeModelWithPriceSpecs<T extends TVolumeAddon> = T &
  TModelPrice &
  TModelAvailabilityZones;

export const mapVolumeModelPriceSpecs = <T extends TVolumeAddon>(
  catalogRegions: TVolumeCatalog['regions'],
  region: string,
  formatCatalogPrice: (price: number) => string,
  t: TFunction<['add']>,
  capacity?: number,
) => {
  const is3azRegion =
    catalogRegions.find((r) => r.name === region).type === 'region-3-az';

  return (model: T): TVolumeModelWithPriceSpecs<T> => ({
    ...model,
    ...getPricingSpecsFromModelPricings(
      model.pricings,
      formatCatalogPrice,
      t,
      capacity,
    ),
    ...getAvailabilityZonesFromModelPricings(model.pricings, is3azRegion),
  });
};

const matchModelName = (modelName: TModelName['name']) => (
  model: TVolumeAddon,
) => model.name === modelName;

const matchRegion = (region: TAPIVolume['region']) => (p: TVolumePricing) =>
  p.regions.includes(region);

const matchEncryptionType = (encryptionType: EncryptionType | null) => (
  p: TVolumePricing,
) => p.specs.encrypted === !!encryptionType;

const matchVolumeType = (volumeType: TAPIVolume['type']) => (
  p: TVolumePricing,
) => p.specs.name === volumeType;

export const getVolumeModelPricings = (catalog: TVolumeCatalog | undefined) => (
  filter: Partial<{
    region: TAPIVolume['region'];
    modelName: TModelName['name'];
    encryptionType: EncryptionType | null;
    volumeType: TAPIVolume['type'];
  }>,
) => {
  if (!catalog) return [];

  let { models } = catalog;

  if (filter.modelName !== undefined)
    models = models.filter(matchModelName(filter.modelName));

  const pricingPredicates = <
    Parameters<typeof models[number]['pricings']['filter']>[0][]
  >[];

  if (filter.region !== undefined)
    pricingPredicates.push(matchRegion(filter.region));

  if (filter.encryptionType !== undefined)
    pricingPredicates.push(matchEncryptionType(filter.encryptionType));

  if (filter.volumeType !== undefined)
    pricingPredicates.push(matchVolumeType(filter.volumeType));

  return models
    .flatMap((m) => m.pricings)
    .filter((...args) =>
      pricingPredicates.every((predicate) => predicate(...args)),
    );
};

export type TModelAttach = {
  shouldUseMultiAttachFileSystem: boolean;
};
type TVolumeModelWithAttach<T extends TVolumeAddon> = T & TModelAttach;
export const mapVolumeModelAttach = <T extends TVolumeAddon>(
  model: T,
): TVolumeModelWithAttach<T> => ({
  ...model,
  shouldUseMultiAttachFileSystem: model.name === 'classic-multiattach',
});

export type TFilterTags = {
  beta: boolean;
  comingSoon: boolean;
};
export const mapFilterTags = <T extends TCatalogGroup>(
  group: T,
): T & TFilterTags => ({
  ...group,
  beta: group.tags.includes('is_new'),
  comingSoon: group.tags.includes('coming_soon'),
});

type TFilterLeastPrice = {
  monthlyPrice: {
    value: string;
    unit: string;
    isLeastPrice: boolean;
  };
};

export function getLeastPrice(pricings: TVolumePricing[]) {
  return pricings.reduce<number | null>(
    (leastPrice, p) =>
      leastPrice === null ? p.price : Math.min(p.price, leastPrice),
    null,
  );
}

export const mapFilterLeastPrice = <T extends TCatalogGroup>(
  regions: TRegion[],
  models: TVolumeAddon[],
  formatCatalogPrice: (price: number) => string,
  t: TFunction<['add', 'order-price', typeof NAMESPACES.BYTES]>,
) => (group: T): T & TFilterLeastPrice => {
  const groupRegions = regions
    .filter((r) => r.type === group.name)
    .map((r) => r.name);

  const hasGroupRegions = (p: TVolumePricing) =>
    p.regions.some((r) => groupRegions.includes(r));

  const hourlyPrice = models
    .map((m) => getLeastPrice(m.pricings.filter(hasGroupRegions)))
    .filter((p) => p !== null)
    .reduce(
      (leastPriceAcc, modelLeastPrice) => {
        if (leastPriceAcc.value === null) {
          leastPriceAcc.value = modelLeastPrice;
        } else if (leastPriceAcc.value !== modelLeastPrice) {
          leastPriceAcc.value = Math.min(modelLeastPrice, leastPriceAcc.value);
          leastPriceAcc.isLeastPrice = true;
        }
        return leastPriceAcc;
      },

      { value: null as number | null, isLeastPrice: false },
    );

  return {
    ...group,
    monthlyPrice: {
      value: formatCatalogPrice(convertHourlyPriceToMonthly(hourlyPrice.value)),
      isLeastPrice: hourlyPrice.isLeastPrice,
      unit: [
        t('order-price:order_catalog_price_tax_excl_label', {
          price: '',
        }).trim(),
        t('order-price:order_catalog_price_interval_month'),
        t(`${NAMESPACES.BYTES}:unit_size_GB`),
      ].join('/'),
    },
  };
};

export type TModelPreselection = {
  isPreselected: boolean;
};

export const mapPreselection = (type?: string | null) => <
  T extends TVolumeAddon
>(
  model: T,
) => {
  const possibleTechnicalNames = model.pricings.map((p) => p.specs.name);

  const isPreselected = type ? possibleTechnicalNames.includes(type) : false;

  return {
    ...model,
    isPreselected,
  };
};

const filterVolumeModelsForRegion = (catalog: TVolumeCatalog, region: string) =>
  catalog.models
    .map((m) => ({
      ...m,
      pricings: m.pricings.filter((p) => p.regions.includes(region)),
    }))
    .filter((m) => m.pricings.length > 0);

export const mapVolumeCatalog = (
  region: string,
  catalogPriceFormatter: (price: number) => string,
  translator: TFunction<['add']>,
) => (catalog: TVolumeCatalog) =>
  filterVolumeModelsForRegion(catalog, region).map<TVolumeModel>(
    pipe(
      mapVolumeModelPriceSpecs(
        catalog.regions,
        region,
        catalogPriceFormatter,
        translator,
      ),
      mapVolumeModelName(catalog.regions, region),
      mapVolumeModelAttach,
    ),
  );

export const mapRetypingVolumeCatalog = (
  region: string,
  catalogPriceFormatter: (price: number) => string,
  translator: TFunction<['add']>,
  type: string | null,
) => (catalog: TVolumeCatalog) =>
  filterVolumeModelsForRegion(catalog, region).map<TVolumeRetypeModel>(
    pipe(
      mapVolumeModelPriceSpecs(
        catalog.regions,
        region,
        catalogPriceFormatter,
        translator,
      ),
      mapVolumeModelName(catalog.regions, region),
      mapVolumeModelAttach,
      mapPreselection(type),
    ),
  );
