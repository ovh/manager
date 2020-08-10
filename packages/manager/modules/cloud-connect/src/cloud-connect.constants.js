export const GUIDELINK = {
  EN: 'https://docs.ovh.com/gb/en/ovhcloud-connect/',
  FR: 'https://docs.ovh.com/fr/ovhcloud-connect/',
};

export const POP_MAP = {
  'lon-ld5': 'UK - London - Equinix - LD5',
  'waw-wa2': 'PL - Warsaw - Equinix - WA2',
  'mad-mad2': 'SP – Madrid – Interxion – MAD2',
  'lon-thw': 'UK - London - Telehouse – West',
  'par-th2': 'FR - Paris - Telehouse - TH2',
  'was-dc5': 'US - Ashburn - Equinix - DC5',
  'fra-fr5': 'DE - Frankfurt - Equinix - FR5',
  'par-pa3': 'FR - Paris - Equinix - PA3',
  'par-gsw': 'FR - Paris - GlobalSwitch - Clichy',
};

export const POP_TYPES = [
  {
    name: 'L2',
    id: 'l2',
  },
  {
    name: 'L3',
    id: 'l3',
  },
];

export const ASN_MIN = 1;

export const IPV4_BLOCK_REGEX = {
  NO_RANGE: new RegExp(
    '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
  ),
  RANGE_0_TO_28: new RegExp(
    '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/[0-2][0-8]?$',
  ),
  RANGE_30: new RegExp(
    '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/30?$',
  ),
};

export const POP_TYPE_CONSTANT = {
  L3: 'l3',
  L2: 'l2',
};

export const STATUS = {
  ACTIVE: 'active',
  INIT: 'init',
  TO_DELETE: 'toDelete',
  ERROR: 'error',
  ENABLED: 'enabled',
  DISABLED: 'disabled',
  TODO: 'todo',
  DOING: 'doing',
  UP: 'up',
  DOWN: 'down',
  DONE: 'done',
  TO_CHECK: 'toCheck',
  CANCELLED: 'cancelled',
  TERMINATED: 'terminated',
};

export default {
  GUIDELINK,
  POP_MAP,
  POP_TYPES,
  POP_TYPE_CONSTANT,
  ASN_MIN,
  IPV4_BLOCK_REGEX,
  STATUS,
};
