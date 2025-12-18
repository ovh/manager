import { TFunction } from 'i18next';
import {
  NASHA_ACL_TYPE_ENUM,
  NASHA_DEFAULT_ZFS_OPTIONS,
  NASHA_PROTOCOL_ENUM,
  NASHA_RECORD_SIZE_ENUM,
  NASHA_SNAPSHOT_ENUM,
  NASHA_SYNC_ENUM,
  NASHA_USE_SIZE_NAME,
} from '@/constants/nasha.constants';
import type { Nasha, NashaPartition, NashaUse, ApiSchema } from '@/types/nasha.type';

/**
 * Prepare use object with translated names and units
 */
const prepareUse = (
  use: Record<string, { unit: string; value: number }>,
  t: TFunction,
): NashaUse => {
  return Object.keys(use).reduce<NashaUse>((result, type) => {
    const item = use[type];
    if (!item) {
      return result;
    }

    const nameKey = `nasha_use_type_${type}`;
    const translatedName = t(nameKey);

    return {
      ...result,
      [type]: {
        ...item,
        name: translatedName === nameKey ? type : translatedName,
        unit: t(`common:nasha_use_unit_${item.unit}`),
      },
    };
  }, {} as NashaUse);
};

/**
 * Prepare nasha object with translated fields
 */
export const prepareNasha = (
  nasha: Nasha,
  t: TFunction,
): Nasha & { localeDatacenter: string; diskSize: string } => {
  const useSize = nasha.use?.[NASHA_USE_SIZE_NAME];
  return {
    ...nasha,
    use: prepareUse(nasha.use, t),
  localeDatacenter: t(`common:nasha_datacenter_${nasha.datacenter.toLowerCase()}`),
    diskSize: useSize
      ? `${useSize.value} ${t(`common:nasha_use_unit_${useSize.unit}`)}`
      : '',
  };
};

/**
 * Prepare partition object with translated fields
 */
export const preparePartition = (
  partition: NashaPartition,
  t: TFunction,
): NashaPartition => ({
  ...partition,
  use: partition.use ? prepareUse(partition.use, t) : null,
  protocol: partition.protocol?.split('_').join(' '),
});

/**
 * Prepare plans from catalog
 */
export const preparePlans = (
  catalog: {
    plans: Array<{
      product: string;
      configurations: Array<{ name: string; values: string[] }>;
      pricings: Array<{ mode: string; capacities: string[] }>;
    }>;
    products: Array<{
      name: string;
      blobs: {
        technical: {
          storage: {
            disks: Array<{ technology: string; capacity: number }>;
          };
        };
      };
    }>;
  },
  bytesFilter: (value: number) => string,
) =>
  catalog.plans
    .filter((plan) => {
      try {
        const product = catalog.products.find(
          ({ name }) => name === plan.product,
        );
        const disk = product?.blobs?.technical?.storage?.disks?.[0];
        if (disk) {
          Object.assign(plan, { disk });
          return Boolean(disk.technology) && Boolean(disk.capacity);
        }
        return false;
      } catch {
        return false;
      }
    })
    .map(({ disk, ...plan }: { disk?: { technology: string; capacity: number }; [key: string]: unknown }) => ({
      ...plan,
      diskType: disk?.technology?.toLowerCase(),
      capacity: {
        label: bytesFilter((disk?.capacity || 0) * 1000 * 1000 * 1000),
        value: (disk?.capacity || 0) / 1000,
      },
      datacenters: (plan.configurations as Array<{ name: string; values: string[] }>)?.find(
        ({ name }) => name === 'datacenter',
      )?.values,
      defaultPrice: (plan.pricings as Array<{ mode: string }>)?.find(
        ({ mode }) => mode === 'default',
      ),
      price: (plan.pricings as Array<{ mode: string; capacities: string[] }>)?.find(
        ({ capacities, mode }) =>
          capacities.includes('renew') && mode === 'default',
      ),
    }));

/**
 * Prepare ZFS options from API response
 */
export const prepareZfsOptions = (
  options: { atime?: string; recordsize?: string; sync?: string } = NASHA_DEFAULT_ZFS_OPTIONS,
) => ({
  atime: options.atime === 'on',
  recordsize: options.recordsize || NASHA_DEFAULT_ZFS_OPTIONS.recordsize,
  sync: options.sync || NASHA_DEFAULT_ZFS_OPTIONS.sync,
});

/**
 * Export ZFS options for API request
 */
export const exportZfsOptions = (
  {
    atime,
    recordsize,
    sync,
    template,
  }: {
    atime: boolean;
    recordsize: string;
    sync: string;
    template?: { name: string };
  },
  customTemplate: string,
) => {
  return !template || template.name === customTemplate
    ? {
        atime: atime ? 'on' : 'off',
        recordsize,
        sync,
      }
    : {
        templateName: template.name,
      };
};

/**
 * Format recordsize enum from schema
 */
export const formatRecordsizeEnum = (
  schema: ApiSchema,
  bytesFilter: (value: number, binary?: boolean) => string,
) =>
  (schema.models?.[NASHA_RECORD_SIZE_ENUM]?.enum ?? [])
    .map((recordsize: string) => ({
      default: recordsize === NASHA_DEFAULT_ZFS_OPTIONS.recordsize,
      label: bytesFilter(parseInt(recordsize, 10), true),
      value: recordsize,
    }))
    .sort(
      (a: { value: string }, b: { value: string }) =>
        Number(a.value) - Number(b.value),
    );

/**
 * Format sync enum from schema
 */
export const formatSyncEnum = (schema: ApiSchema) =>
  (schema.models?.[NASHA_SYNC_ENUM]?.enum ?? []).map((sync: string) => ({
    default: sync === NASHA_DEFAULT_ZFS_OPTIONS.sync,
  label: sync ? `${sync.slice(0, 1).toUpperCase()}${sync.slice(1)}` : '',
    value: sync,
  }));

/**
 * Format protocol enum from schema
 */
export const formatProtocolEnum = (schema: ApiSchema) =>
  (schema.models?.[NASHA_PROTOCOL_ENUM]?.enum ?? []).map((protocol: string) => ({
    label: protocol.replace(/_/g, ' '),
    value: protocol,
  }));

/**
 * Format snapshot enum from schema
 */
export const formatSnapshotEnum = (schema: ApiSchema, t: TFunction) =>
  (schema.models?.[NASHA_SNAPSHOT_ENUM]?.enum ?? []).map((type: string) => ({
    label: t(`nasha_snapshot_type_${type}`),
    value: type,
  }));

/**
 * Format ACL type enum from schema
 */
export const formatAclTypeEnum = (schema: ApiSchema, t: TFunction) =>
  (schema.models?.[NASHA_ACL_TYPE_ENUM]?.enum ?? []).map((type: string) => ({
    label: t(`nasha_acl_type_${type}`),
    value: type,
  }));

/**
 * Convert IP block to number for sorting
 */
export const ipBlockToNumber = (ipBlock: string): number =>
  Number(
    ipBlock
      .replace('/', '.')
      .split('.')
      .map((n) => n.padStart(3, '0'))
      .join(''),
  );

/**
 * Format bytes to human readable string
 */
export const formatBytes = (bytes: number, binary = false): string => {
  if (bytes === 0) return '0 B';
  const k = binary ? 1024 : 1000;
  const sizes = binary
    ? ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']
    : ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

