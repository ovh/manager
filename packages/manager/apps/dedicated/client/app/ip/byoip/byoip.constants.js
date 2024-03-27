export const AS_OPTIONS = ['ovh_cloud', 'own'];
export const CONFIG_NAME = {
  CAMPUS: 'campus',
  IPRIR: 'ipRir',
};

export const STEP_NAME = {
  RIR: 'select-rir',
  LOCATION: 'select-location',
  IP_RANGE: 'select-ip-range',
  AS: 'select-autonomous-system',
};

export const IPV4_BLOCK_PATTERN = /^(?:(?:25[0-5]|(2[0-4]|1\d|[1-9]|)\d)(\.(?!$)|$)){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?\/((19|2[0-4]))?)$/;

export const BYOIP_FAILOVER_V4 = 'byoip-failover-v4';

export default {
  AS_OPTIONS,
  CONFIG_NAME,
  IPV4_BLOCK_PATTERN,
  STEP_NAME,
  BYOIP_FAILOVER_V4,
};
