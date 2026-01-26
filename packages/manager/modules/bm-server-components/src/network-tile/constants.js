export const GAME_DDOS_STATUS = {
  noIpConfigured: {
    value: 'no_ip_configured',
    class: 'oui-badge_error',
    trackingSuffix: 'red',
  },
  someIpsConfigured: {
    value: 'some_ips_configured',
    class: 'oui-badge_warning',
    trackingSuffix: 'orange',
  },
  allIpsConfigured: {
    value: 'all_ips_configured',
    class: 'oui-badge_success',
    trackingSuffix: 'green',
  },
};
