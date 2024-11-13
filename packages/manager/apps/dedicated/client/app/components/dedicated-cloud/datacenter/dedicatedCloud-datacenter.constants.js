export const DEDICATED_CLOUD_DATACENTER = {
  alertId: 'dedicatedCloudDatacenterAlert',
  elementTypes: {
    host: {
      planFamily: 'host-hourly',
    },
    datastore: {
      planFamily: 'datastore-hourly',
    },
  },
};

export const TRACKING_PREFIX = 'Enterprise::PrivateCloud::';

export const COMMERCIAL_RANGE_NAME_EOL = [
  'dedicated_cloud_2016',
  'cdi_2018',
  'legacy',
];

export const VDC_MIRGRATION_GUIDE_LINK = {
  FR: 'https://docs.ovh.com/fr/private-cloud/vdc-migration/',
  DEFAULT: 'https://docs.ovh.com/gb/en/private-cloud/vdc-migration/',
};

export const TRACKING_NEW_PRODUCT_BANNER = {
  on: 'click',
  type: 'action',
  name:
    'dedicated::dedicatedCloud::details::datacenter::link-to-vmware-products',
};

export const LANGUAGE_OVERRIDE = { IN: `en-IN` };

export default {
  DEDICATED_CLOUD_DATACENTER,
  COMMERCIAL_RANGE_NAME_EOL,
  VDC_MIRGRATION_GUIDE_LINK,
  TRACKING_NEW_PRODUCT_BANNER,
  LANGUAGE_OVERRIDE,
  TRACKING_PREFIX,
};
