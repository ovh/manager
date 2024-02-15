export const URL_WHITELIST = [
  'https://compute.*.cloud.ovh.net:6080/**', // VNC PUBLIC CLOUD
  'https://compute.*.cloud.ovh.us:6080/**',
  'https://compute.*.trustedzone.cloud.ovh.net:6080/**', // VNC PUBLIC CLOUD FOR TRUSTED ZONE
  'https://novnc.*.cloud.ovh.net/**', // VNC FOR LOCAL ZONES
];

export default {
  URL_WHITELIST,
};
