export const BANDWIDTH_OUT = 'bandwidth_instance_out.consumption';
export const EXCLUDE_FLAVOR_CATEGORIES = ['baremetal'];

export const INSTANCE_MODES_ENUM = [
  { mode: 'public_mode' },
  { mode: 'private_mode' },
];

export const AVAILABLE_SUBNET = [
  '192.168.0.1/24',
  '10.0.0.1/24',
  '172.16.0.1/24',
];
export const INSTANCE_READ_MORE_GUIDE = {
  ALL_GUIDE: {
    DEFAULT:
      'https://docs.ovh.com/gb/en/public-cloud/attaching-pci-floating-ip-to-instance/',
  },
};

export const INSTANCE_ACTIVE_STATUS = 'ACTIVE';

export default {
  BANDWIDTH_OUT,
  EXCLUDE_FLAVOR_CATEGORIES,
  INSTANCE_MODES_ENUM,
  AVAILABLE_SUBNET,
  INSTANCE_READ_MORE_GUIDE,
  INSTANCE_ACTIVE_STATUS,
};
