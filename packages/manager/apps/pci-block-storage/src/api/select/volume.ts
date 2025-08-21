import {
  ColumnSort,
  getMacroRegion,
  PaginationState,
} from '@ovh-ux/manager-react-components';
import { TFunction } from 'i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TVolume } from '@/api/hooks/useVolume';
import {
  AddVolumeProps,
  TAPIVolume,
  TUpdateVolumeProps,
} from '@/api/data/volume';
import { TVolumeCatalog } from '@/api/data/catalog';
import {
  getPricingSpecsFromModelPricings,
  getVolumeModelPricings,
  TModelPrice,
} from '@/api/select/catalog';

export const sortResults = (
  items: TVolume[],
  sorting: ColumnSort | undefined,
) => {
  if (!sorting) return items;

  let sortFn: (a: TVolume, b: TVolume) => number;

  switch (sorting.id) {
    case 'status':
      sortFn = (a, b) => (a.statusGroup > b.statusGroup ? 1 : 0);
      break;
    case 'attachedTo':
      sortFn = (a, b) => {
        const aAttachedTo = a.attachedTo[0] || '';
        const bAttachedTo = b.attachedTo[0] || '';
        return aAttachedTo > bAttachedTo ? 1 : 0;
      };
      break;
    default:
      sortFn = (a, b) => (a[sorting.id] > b[sorting.id] ? 1 : 0);
      break;
  }

  return [...items].sort(sorting.desc ? (a, b) => -sortFn(a, b) : sortFn);
};

export const paginateResults = <T>(
  items: T[],
  pagination: PaginationState,
) => ({
  rows: items.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  ),
  pageCount: Math.ceil(items.length / pagination.pageSize),
  totalRows: items.length,
});

export type TVolumeRegion = { regionName: string };
export const mapVolumeRegion = <V extends TAPIVolume>(
  t: TFunction<['region']>,
) => (volume: V): V & TVolumeRegion => ({
  ...volume,
  regionName: t(
    `region:manager_components_region_${getMacroRegion(volume.region)}_micro`,
    {
      micro:
        volume.availabilityZone && volume.availabilityZone !== 'any'
          ? volume.availabilityZone
          : volume.region,
    },
  ),
});

export type TVolumeStatus = {
  statusGroup: string;
  statusLabel: string;
};
export const mapVolumeStatus = <V extends TAPIVolume>(
  t: TFunction<['common']>,
) => (volume: V): V & TVolumeStatus => {
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
    ['error', 'error_deleting', 'error_restoring', 'error_extending'].includes(
      volume.status,
    )
  ) {
    statusGroup = 'ERROR';
  }

  return {
    ...volume,
    statusGroup,
    statusLabel: t('common:pci_projects_project_storages_blocks_status', {
      context: statusGroup,
      defaultValue: volume.status,
    }),
  };
};

export const getVolumePricing = (catalog?: TVolumeCatalog) => {
  const catalogPricing = catalog?.models.flatMap((m) => m.pricings) ?? [];

  return (volume: Pick<TAPIVolume, 'type' | 'region'>) =>
    catalogPricing.find(
      (p) => p.specs.name === volume.type && p.regions.includes(volume.region),
    );
};

export type TVolumeAttach = {
  canAttachInstance: boolean;
  canDetachInstance: boolean;
  maxAttachedInstances: number;
};

export const mapVolumeAttach = <V extends TAPIVolume>(
  catalog?: TVolumeCatalog,
) => {
  const getPricing = getVolumePricing(catalog);

  return (volume: V): V & TVolumeAttach => {
    const pricing = getPricing(volume);

    const maxAttachedInstances = pricing?.specs.maxAttachedInstances || 1;

    return {
      ...volume,
      maxAttachedInstances,
      canAttachInstance: maxAttachedInstances > volume.attachedTo.length,
      canDetachInstance: volume.attachedTo.length > 0,
    };
  };
};

export const enum EncryptionType {
  OMK = 'OMK',
  CMK = 'CMK',
}

export type TVolumeEncryption = {
  encryptionStatus: string;
  encrypted: boolean | null;
  encryptionType: EncryptionType | null;
};

export const getEncryption = (catalog?: TVolumeCatalog) => <
  V extends TAPIVolume
>(
  volume: V,
) => {
  const encrypted = getVolumePricing(catalog)(volume)?.specs.encrypted ?? null;
  const encryptionType = encrypted ? EncryptionType.OMK : null;

  return {
    encrypted,
    encryptionType,
  };
};

export const mapVolumeEncryption = <V extends TAPIVolume>(
  t: TFunction<['common']>,
  catalog?: TVolumeCatalog,
) => {
  const getEncryptionForVolume = getEncryption(catalog);

  return (volume: V): V & TVolumeEncryption => {
    const { encrypted, encryptionType } = getEncryptionForVolume(volume);

    let encryptionStatusContext = 'UNKNOWN';
    if (encrypted !== null) {
      encryptionStatusContext = encrypted ? 'ACTIVE' : 'NONE';
    }

    return {
      ...volume,
      encryptionStatus: t(
        'common:pci_projects_project_storages_blocks_status',
        {
          context: encryptionStatusContext,
          defaultValue: encryptionStatusContext,
        },
      ),
      encryptionType,
      encrypted,
    };
  };
};

export type TVolumePricing =
  | TModelPrice
  | {
      [P in keyof TModelPrice]?: undefined;
    };
export const mapVolumePricing = <V extends TAPIVolume>(
  catalogData: TVolumeCatalog | undefined,
  formatCatalogPrice: (price: number) => string,
  t: TFunction<['add', 'common', typeof NAMESPACES.BYTES]>,
  capacity?: number,
) => {
  const getPricings = getVolumeModelPricings(catalogData);

  return (volume: V): V & TVolumePricing => {
    const volumePricings = getPricings({
      region: volume.region,
      volumeType: volume.type,
    });

    if (!volumePricings.length) return volume;

    return {
      ...volume,
      ...getPricingSpecsFromModelPricings(
        volumePricings,
        formatCatalogPrice,
        t,
        capacity ?? volume.size,
      ),
    };
  };
};

export type TVolumeToAdd = {
  name: string;
  region: string;
  size: number;
  type: string;
  encryptionType: EncryptionType | null;
  availabilityZone: string | null;
};

export const mapVolumeToAdd = (projectId: string, catalog: TVolumeCatalog) => ({
  name,
  region,
  size,
  type,
  availabilityZone,
  encryptionType,
}: TVolumeToAdd): AddVolumeProps => {
  const pricing = catalog.models
    .find((m) => m.name === type)
    .pricings.find(
      (p) =>
        p.regions.includes(region) && p.specs.encrypted === !!encryptionType,
    );

  return {
    projectId,
    name,
    region,
    size,
    type: pricing.specs.name,
    availabilityZone,
  };
};

export type TVolumeToEdit = {
  projectId: string;
  volumeToEdit: {
    name: string;
    size: number;
    bootable: boolean;
  };
  originalVolume: TVolume;
};

export const mapVolumeToEdit = ({
  projectId,
  volumeToEdit: { name, size, bootable },
  originalVolume,
}: TVolumeToEdit): TUpdateVolumeProps => ({
  projectId,
  volumeToUpdate: {
    name,
    size,
    bootable,
  },
  originalVolume: {
    id: originalVolume.id,
    name: originalVolume.name,
    bootable: originalVolume.bootable,
    size: originalVolume.size,
  },
});
