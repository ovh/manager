export const GUIDE_URLS = {
  FAILOVER_IP: {
    DEFAULT: 'https://www.ovhcloud.com/en/bare-metal/ip/',
  },
  CONF_FAILOVER_IP: {
    FR: 'https://docs.ovh.com/fr/public-cloud/configurer_une_ip_failover/',
    DEFAULT:
      'https://docs.ovh.com/gb/en/public-cloud/make-failover-ip-configuration-persistent/',
  },
  REGIONS_AVAILABILITY: {
    FR: 'https://www.ovhcloud.com/fr/public-cloud/regions-availability/',
    DE: 'https://www.ovhcloud.com/de/public-cloud/regions-availability/',
    ES: 'https://www.ovhcloud.com/es-es/public-cloud/regions-availability/',
    IT: 'https://www.ovhcloud.com/it/public-cloud/regions-availability/',
    NL: 'https://www.ovhcloud.com/nl/public-cloud/regions-availability/',
    PL: 'https://www.ovhcloud.com/pl/public-cloud/regions-availability/',
    PT: 'https://www.ovhcloud.com/pt/public-cloud/regions-availability/',
    GB: 'https://www.ovhcloud.com/en-gb/public-cloud/regions-availability/',
    CA: 'https://www.ovhcloud.com/en-ca/public-cloud/regions-availability/',
    QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/regions-availability/',
    AU: 'https://www.ovhcloud.com/en-au/public-cloud/regions-availability/',
    SG: 'https://www.ovhcloud.com/en-sg/public-cloud/regions-availability/',
    DEFAULT:
      'https://www.ovhcloud.com/en-ie/public-cloud/regions-availability/',
  },
};

export const TRACKING_PREFIX =
  'PublicCloud::pci::projects::project::additional-ips';

export const TRACKING_GUIDE_LINKS = {
  FLOATING_IP_REGION_AVAILABILITY: `${TRACKING_PREFIX}::add::floating-ips-region-availability`,
  FAILOVER_IP_CONFIGURATION_GUIDE: `${TRACKING_PREFIX}::add::guide-configure-failover-ip`,
  DISCOVER_FAILOVER_IP: `${TRACKING_PREFIX}::add::discover-failover-ip`,
};

export const REGIONS = {
  EU: ['EUROPE', 'CANADA'],
  CA: ['EUROPE', 'CANADA'],
  US: ['USA'],
};
