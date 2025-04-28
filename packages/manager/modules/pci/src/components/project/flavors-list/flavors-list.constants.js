export const DEFAULT_OS = ['linux', 'baremetal-linux'];

export const CATEGORIES = [
  {
    category: 'balanced',
    title: 'General Purpose',
    pattern: /eg/,
  },
  {
    category: 'cpu',
    title: 'Compute Optimized',
    pattern: /cpu|hg/,
  },
  {
    category: 'ram',
    title: 'Memory Optimized',
    pattern: /ram/,
  },
  {
    category: 'accelerated',
    title: 'GPU',
    pattern: /gpu|nvme/,
  },
  {
    category: 'discovery',
    title: 'Discovery',
    pattern: /d2/,
  },
  {
    category: 'iops',
    title: 'Storage Optimized',
    pattern: /ovh\.iops/,
  },
  {
    category: 'baremetal',
    title: 'Metal',
    pattern: /baremetal/,
  },
];

export const FLEX_TYPE = /flex$/;

export const LEGACY_FLAVORS = /eg|sp|hg|vps-ssd/;

export const SSD_DISK_TYPES = [/ssd/, /nvme/, /iops/, /baremetal/, /d2/];

export const DEFAULT_CATALOG_ENDPOINT = '/order/catalog/public/cloud';

export const LOCAL_ZONE = 'localzone';

export const ONE_AZ_REGION = 'region';

export const THREE_AZ_REGION = 'region-3-az';

export default {
  CATEGORIES,
  DEFAULT_OS,
  FLEX_TYPE,
  LEGACY_FLAVORS,
  SSD_DISK_TYPES,
  DEFAULT_CATALOG_ENDPOINT,
  LOCAL_ZONE,
  THREE_AZ_REGION,
  ONE_AZ_REGION,
};
