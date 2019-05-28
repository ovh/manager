export const BREAKPOINT = 1024;

export const DESKTOP_STEPS = [
  {
    element: '#server',
    content: 'walkme_content_server',
  },
  {
    element: '#public-cloud',
    content: 'walkme_content_cloud',
  },
];

export const KEY = 'NAVBAR_SERVER_PUBLIC_CLOUD_WALKME';

export const MOBILE_STEPS = [
  {
    element: 'oui-navbar',
    content: 'walkme_content_server_mobile',
  },
  {
    element: 'oui-navbar',
    content: 'walkme_content_cloud_mobile',
  },
];

export default {
  BREAKPOINT,
  DESKTOP_STEPS,
  KEY,
  MOBILE_STEPS,
};
