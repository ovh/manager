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

export const TRACKING_CLICK_GO_TO_TAB_PREFIX = 'main-tabnav::go-to-tab::';

export const TRACKING_PAGE_GO_TO_TAB_PREFIX = 'datacenter::details::';

export const LANGUAGE_OVERRIDE = { IN: `en-IN` };

export const TRACKING_VIRTUAL_MACHINE_TAB =
  'datacenter::details::virtual-machine';

export default {
  DEDICATED_CLOUD_DATACENTER,
  COMMERCIAL_RANGE_NAME_EOL,
  VDC_MIRGRATION_GUIDE_LINK,
  TRACKING_NEW_PRODUCT_BANNER,
  LANGUAGE_OVERRIDE,
};
