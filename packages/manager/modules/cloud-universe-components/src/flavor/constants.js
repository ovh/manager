export const FLAVORTYPE_CATEGORY = [
  {
    id: 'balanced',
    types: ['ovh.ceph.eg', 'ovh.ssd.eg'],
    migrationNotAllowed: ['vps'],
    order: 1,
  },
  {
    id: 'cpu',
    types: ['ovh.cpu', 'ovh.ssd.cpu', 'ovh.ceph.hg'],
    migrationNotAllowed: ['vps'],
    order: 2,
  },
  {
    id: 'ram',
    types: ['ovh.ram', 'ovh.ssd.ram'],
    migrationNotAllowed: ['vps'],
    order: 3,
  },
  {
    id: 'accelerated',
    types: [
      'ovh.ssd.gpu',
      'ovh.ssd.gpu2',
      'ovh.ssd.gpu3',
      'ovh.ssd.fpga2',
      'ovh.raid-nvme.t1',
    ],
    migrationNotAllowed: ['vps'],
    order: 4,
  },
  {
    id: 'vps',
    types: ['ovh.vps-ssd'],
    migrationNotAllowed: [],
    order: 5,
  },
];

export const INSTANCE_CPU_FREQUENCY = {
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

export const INSTANCE_NUMBER_OF_GPUS = {
  default: 1,
  120: 3,
  45: 1,
  90: 2,
};

export default {
  FLAVORTYPE_CATEGORY,
  INSTANCE_CPU_FREQUENCY,
  INSTANCE_NUMBER_OF_GPUS,
};
