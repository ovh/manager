export const DEFAULT_OS = 'linux';

export const CATEGORIES = [
  {
    category: 'balanced',
    pattern: /eg/,
  },
  {
    category: 'cpu',
    pattern: /cpu|hg/,
  },
  {
    category: 'ram',
    pattern: /ram/,
  },
  {
    category: 'accelerated',
    pattern: /gpu|nvme/,
  },
  {
    category: 'vps',
    pattern: /vps/,
  },
];

export const FLEX_TYPE = /flex$/;

export const LEGACY_FLAVORS = /eg|sp|hg|vps-ssd/;

export const SSD_DISK_TYPES = [/ssd/, /nvme/];

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
};

export default {
  CPU_FREQUENCY,
  DEFAULT_OS,
  FLEX_TYPE,
  LEGACY_FLAVORS,
  SSD_DISK_TYPES,
};
