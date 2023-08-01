export const NOT_SUBSCRIBED = 'notSubscribed';
export const SERVER_OPTIONS = {
  BANDWIDTH: 'BANDWIDTH',
  BANDWIDTH_VRACK: 'BANDWIDTH_VRACK',
};

export const GUIDE_URL = {
  ALL_GUIDE: {
    FR: 'https://docs.ovh.com/fr/nutanix/',
    DEFAULT: 'https://docs.ovh.com/gb/en/nutanix/',
  },
};

export const OLD_CLUSTER_PLAN_CODE = [
  'nutanix-21hci01-byol',
  'nutanix-21hci02-byol',
  'nutanix-21hci03-byol',
  'nutanix-pro-21hci01',
  'nutanix-pro-21hci02',
  'nutanix-pro-21hci03',
  'nutanix-ultimate-21hci01',
  'nutanix-ultimate-21hci02',
  'nutanix-ultimate-21hci03',
];

export const LICENSE_REGISTRATION_ENDS_IN_DAYS = 90;

export default {
  NOT_SUBSCRIBED,
  SERVER_OPTIONS,
  GUIDE_URL,
  LICENSE_REGISTRATION_ENDS_IN_DAYS,
  OLD_CLUSTER_PLAN_CODE,
};
