export const DEFAULT_OS = ['linux', 'baremetal-linux'];

export const CATEGORIES = [
  {
    category: 'balanced',
    title: 'General Purpose',
    pattern: /eg/,
  },
  {
    category: 'cpu',
    title: 'CPU',
    pattern: /cpu|hg/,
  },
  {
    category: 'ram',
    title: 'RAM',
    pattern: /ram/,
  },
  {
    category: 'accelerated',
    title: 'GPU',
    pattern: /gpu|nvme/,
  },
  {
    category: 'vps',
    title: 'Sandbox',
    pattern: /vps/,
  },
  {
    category: 'discovery',
    title: 'Discovery',
    pattern: /d2/,
    isNew: true,
  },
  {
    category: 'iops',
    title: 'IOPS',
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

export default {
  CATEGORIES,
  DEFAULT_OS,
  FLEX_TYPE,
  LEGACY_FLAVORS,
  SSD_DISK_TYPES,
  DEFAULT_CATALOG_ENDPOINT,
};
