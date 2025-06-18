import { convertHourlyPriceToMonthly } from '@ovh-ux/manager-react-components';
import { TFunction } from 'i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  TCatalogGroup,
  TVolumeAddon,
  TVolumeCatalog,
  TVolumePricing,
} from '@/api/data/catalog';
import { TRegion } from '@/api/data/regions';

export type TModelName = {
  displayName: string;
};
type TVolumeModelWithName<T extends TVolumeAddon> = T & TModelName;

export const mapVolumeModelName = <T extends TVolumeAddon>(
  catalogRegions: TVolumeCatalog['regions'],
  region: string,
) => {
  const is3azRegion =
    catalogRegions.find((r) => r.name === region).type === 'region-3-az';

  return (model: T): TVolumeModelWithName<T> => ({
    ...model,
    displayName:
      is3azRegion && model.name === 'classic-multiattach'
        ? 'Classic 3AZ'
        : model.name,
  });
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
  availabilityZonesCount: number | null;
  showAvailabilityZones: boolean;
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
  is3azRegion: boolean,
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

  let availabilityZonesCount: TModelPrice['availabilityZonesCount'] = null;
  if (is3azRegion) {
    availabilityZonesCount = pricing.showAvailabilityZones ? 1 : 3;
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
    availabilityZonesCount,
    showAvailabilityZones: pricing.showAvailabilityZones,
    encrypted: pricings.some((p) => p.specs.encrypted),
    capacity: {
      max: pricing.specs.volume.capacity.max * 10 ** 9,
    },
    technicalName: pricing.specs.name,
  };
};

type TVolumeModelWithPriceSpecs<T extends TVolumeAddon> = T & TModelPrice;

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
      is3azRegion,
      formatCatalogPrice,
      t,
      capacity,
    ),
  });
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
