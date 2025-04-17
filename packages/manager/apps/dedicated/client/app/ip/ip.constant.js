export const BRING_YOUR_OWN_IP = 'Bring your own IP';
export const ADDITIONAL_IP = 'Additional IP';

export const TRACKING_PREFIX = 'dedicated::ip';

export const REPRICING_BANNER_URL = {
  FR: 'https://blog.ovhcloud.com/ipv4-additionnelles-nouvelle-tarification/',
  DEFAULT: 'https://blog.ovhcloud.com/additional-ipv4-new-pricing/',
};

export const GUIDE_LINKS = {
  additional_ip:
    'https://help.ovhcloud.com/csm/fr-public-cloud-network-configure-additional-ip?id=kb_article_view&sysparm_article=KB0050241',
  ip_alias:
    'https://help.ovhcloud.com/csm/fr-dedicated-servers-network-ipaliasing?id=kb_article_view&sysparm_article=KB0043761',
  ip_proxmox:
    'https://help.ovhcloud.com/csm/fr-dedicated-servers-proxmox-network-hg-scale?id=kb_article_view&sysparm_article=KB0043915',
  floating_ip:
    'https://help.ovhcloud.com/csm/fr-public-cloud-network-additional-ip-vs-floating-ip?id=kb_article_view&sysparm_article=KB0050159',
};

export const REPRICING_BANNER_DATE_MIN = '2022-12-01 00:00:00';
export const REPRICING_BANNER_DATE_MAX = '2023-09-10 23:59:59';
export const REPRICING_BANNER_DATE_CREATION = '2022-10-06 00:00:00';
export const IP_SERVICE_PATH = '/ip/service/{serviceName}';

export default {
  BRING_YOUR_OWN_IP,
  ADDITIONAL_IP,
  TRACKING_PREFIX,
  REPRICING_BANNER_URL,
  REPRICING_BANNER_DATE_MIN,
  REPRICING_BANNER_DATE_MAX,
  REPRICING_BANNER_DATE_CREATION,
  IP_SERVICE_PATH,
};
