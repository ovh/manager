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

export default {
  DEFAULT_OS,
  FLEX_TYPE,
  LEGACY_FLAVORS,
  SSD_DISK_TYPES,
};
