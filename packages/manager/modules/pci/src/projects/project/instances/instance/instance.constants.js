export const DEDICATED_IPS_URL = {
  CA: 'https://ca.ovh.com/manager/dedicated/#/configuration/ip',
  EU: 'https://www.ovh.com/manager/dedicated/index.html#/configuration/ip',
  US: 'https://us.ovhcloud.com/manager/dedicated/#/configuration/ip',
};

export const MITIGATION_URL = (ip, region) =>
  `${DEDICATED_IPS_URL[region]}?action=mitigation&ip=${ip}&ipBlock=${ip}`;

export const FIREWALL_URL = (ip, region) =>
  `${DEDICATED_IPS_URL[region]}?action=toggleFirewall&ip=${ip}&ipBlock=${ip}`;

export default {
  DEDICATED_IPS_URL,
  FIREWALL_URL,
  MITIGATION_URL,
};
