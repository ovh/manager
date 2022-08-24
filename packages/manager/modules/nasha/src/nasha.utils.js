import {
  NASHA_ACL_TYPE_ENUM,
  NASHA_DEFAULT_ZFS_OPTIONS,
  NASHA_PROTOCOL_ENUM,
  NASHA_RECORD_SIZE_ENUM,
  NASHA_SNAPSHOT_ENUM,
  NASHA_SYNC_ENUM,
  NASHA_USE_SIZE_NAME,
} from './nasha.constants';

/*
 * use = {
 *   usedbysnapshots: {
 *     unit: 'GB',
 *     value: 0.02,
 *     name: 'Snapshots', // obtained by translating the usedbysnapshots type
 *   },
 *   ...
 * }
 */
const prepareUse = (use, $translate) =>
  Object.keys(use).reduce(
    (result, type) => ({
      ...result,
      [type]: {
        ...use[type],
        name: (() => {
          const key = `nasha_use_type_${type}`;
          const name = $translate.instant(key);
          return name === key ? type : name;
        })(),
        unit: $translate.instant(`nasha_use_unit_${use[type].unit}`),
      },
    }),
    {},
  );

export const prepareNasha = ({ use, ...nasha }, $translate) => {
  const useSize = use[NASHA_USE_SIZE_NAME];
  return {
    ...nasha,
    use: prepareUse(use, $translate),
    localeDatacenter: $translate.instant(
      `nasha_datacenter_${nasha.datacenter.toLowerCase()}`,
    ),
    diskSize: `${useSize.value} ${$translate.instant(
      `nasha_use_unit_${useSize.unit}`,
    )}`,
  };
};

export const preparePartition = ({ use, ...partition }, $translate) => ({
  ...partition,
  use: use ? prepareUse(use, $translate) : null,
  protocol: partition.protocol?.split('_').join(' '),
});

export const preparePlans = (catalog, $filter) =>
  catalog.plans
    .filter((plan) => {
      try {
        const disk = catalog.products.find(({ name }) => name === plan.product)
          .blobs.technical.storage.disks[0];
        Object.assign(plan, { disk });
        return Boolean(disk.technology) && Boolean(disk.capacity);
      } catch (error) {
        return false;
      }
    })
    .map(({ disk, ...plan }) => ({
      ...plan,
      diskType: disk.technology.toLowerCase(),
      capacity: {
        label: $filter('bytes')(disk.capacity * 1000 * 1000 * 1000),
        value: disk.capacity / 1000,
      },
      datacenters: plan.configurations.find(({ name }) => name === 'datacenter')
        ?.values,
      defaultPrice: plan.pricings.find(({ mode }) => mode === 'default'),
      price: plan.pricings.find(
        ({ capacities, mode }) =>
          capacities.includes('renew') && mode === 'default',
      ),
    }));

export const prepareZfsOptions = ({
  atime,
  recordsize,
  sync,
} = NASHA_DEFAULT_ZFS_OPTIONS) => ({
  atime: atime === 'on',
  recordsize,
  sync,
});

export const exportZfsOptions = ({ atime, recordsize, sync }) => ({
  atime: atime ? 'on' : 'off',
  recordsize,
  sync,
});

export const formatRecordsizeEnum = (schema, bytesFilter) =>
  schema.models[NASHA_RECORD_SIZE_ENUM].enum
    .map((recordsize) => ({
      default: recordsize === NASHA_DEFAULT_ZFS_OPTIONS.recordsize,
      label: bytesFilter(parseInt(recordsize, 10), true),
      value: recordsize,
    }))
    .sort(({ value: a }, { value: b }) => Number(a) - Number(b));

export const formatSyncEnum = (schema) =>
  schema.models[NASHA_SYNC_ENUM].enum.map((sync) => ({
    default: sync === NASHA_DEFAULT_ZFS_OPTIONS.sync,
    label: `${sync[0].toUpperCase()}${sync.slice(1)}`,
    value: sync,
  }));

export const formatProtocolEnum = (schema) =>
  schema.models[NASHA_PROTOCOL_ENUM].enum.map((protocol) => ({
    label: protocol.replace(/_/g, ' '),
    value: protocol,
  }));

export const formatSnapshotEnum = (schema, $translate) =>
  schema.models[NASHA_SNAPSHOT_ENUM].enum.map((type) => ({
    label: $translate.instant(`nasha_snapshot_type_${type}`),
    value: type,
  }));

export const formatAclTypeEnum = (schema, $translate) =>
  schema.models[NASHA_ACL_TYPE_ENUM].enum.map((type) => ({
    label: $translate.instant(`nasha_acl_type_${type}`),
    value: type,
  }));

export const ipBlockToNumber = (ipBlock) =>
  Number(
    ipBlock
      .replace('/', '.')
      .split('.')
      .map((n) => n.padStart(3, 0))
      .join(''),
  );

export default {
  exportZfsOptions,
  ipBlockToNumber,
  formatAclTypeEnum,
  formatProtocolEnum,
  formatRecordsizeEnum,
  formatSnapshotEnum,
  formatSyncEnum,
  prepareNasha,
  preparePartition,
  preparePlans,
  prepareZfsOptions,
};
