export const DATASTORES_REQUIRED = 2;

export const HOST_TYPE = {
  STANDARD: 'standard',
  VSAN: 'vsan',
  SAPHANA: 'saphana',
};

export const ORDER_URL_SUFFIX = {
  US: 'dedicatedCloud/?v=2#/private-cloud/build?selection=',
  DEFAULT: 'privateCloud/?v=2#/private-cloud/build?selection=',
};

export const VDC_TYPE = {
  NSX: 'nsx-t',
  VSPHERE: 'vsphere',
};

export default {
  DATASTORES_REQUIRED,
  HOST_TYPE,
  ORDER_URL_SUFFIX,
  VDC_TYPE,
};
