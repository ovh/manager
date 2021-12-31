export const DEFAULT_OS = 'linux';

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
    title: 'Bare Metal',
    pattern: /baremetal/,
  },
];

export const FLEX_TYPE = /flex$/;

export const LEGACY_FLAVORS = /eg|sp|hg|vps-ssd/;

export const SSD_DISK_TYPES = [/ssd/, /nvme/, /iops/, /baremetal/, /d2/];

export const CPU_FREQUENCY = {
  'ovh.vps-ssd': 2.4,
  'ovh.cpu': 3.1,
  'ovh.ram': 2.4,
  'ovh.ceph.eg': 2.3,
  'ovh.ssd.ram': 2.4,
  'ovh.ssd.cpu': 3.1,
  'ovh.ssd.eg': 2.3,
  'ovh.ssd.gpu': 3.1,
  'ovh.ssd.gpu2': 3.1,
  'ovh.ssd.gpu3': 3.1,
  'ovh.raid-nvme.t1': 2.1,
  'ovh.iops': 2,
};

export const DEFAULT_CATALOG_ENDPOINT = '/order/catalog/public/cloud';

export default {
  CATEGORIES,
  CPU_FREQUENCY,
  DEFAULT_OS,
  FLEX_TYPE,
  LEGACY_FLAVORS,
  SSD_DISK_TYPES,
  DEFAULT_CATALOG_ENDPOINT,
};
