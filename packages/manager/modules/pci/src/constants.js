export const CLOUD_INSTANCE_DEFAULTS = {
  region: 'WAW1',
  image: 'Ubuntu 16.04',
  flavor: 'b2-30',
};

export const BETA = 'beta';

export const CLOUD_INSTANCE_DEFAULT_FALLBACK = {
  region: 'WAW1',
  image: 'Ubuntu 16.04',
  flavor: 's1-2',
};

export const TAGS_BLOB = {
  ACTIVE: 'active',
  IS_NEW: 'is_new',
  COMING_SOON: 'coming_soon',
};

export const FLOATINGIP_ADDON_FAMILY = 'floatingip';
export const FLOATINGIP_PLANCODE = 'floatingip.floatingip.hour.consumption';

export const CLOUD_FLAVOR_SPECIFIC_IMAGE = ['g1', 'g2', 'g3', 't1'];

export const CLOUD_INSTANCE_HAS_GUARANTEED_RESSOURCES = [
  'balanced',
  'ram',
  'cpu',
  'accelerated',
];

export const CLOUD_VOLUME_TYPES = ['classic', 'high-speed'];

export const CLOUD_IPFO_ORDER_LIMIT = {
  'ovh.vps-ssd': 16,
  'ovh.cpu': 256,
  'ovh.ram': 256,
  'ovh.ssd.cpu': 256,
  'ovh.ssd.ram': 256,
  'ovh.ssd.eg': 256,
  'ovh.ceph.eg': 256,
  'ovh.ssd.gpu': 256,
  'ovh.ssd.gpu2': 256,
  'ovh.ssd.gpu3': 256,
};

export const CLOUD_GEOLOCALISATION = {
  instance: {
    EU: ['SBG1', 'GRA1', 'GRA3', 'GRA5', 'SBG3', 'SBG5', 'WAW1', 'DE1', 'UK1'],
    CA: ['BHS1', 'BHS3'],
    APAC: ['SYD1', 'SGP1'],
  },
  user: {
    EU: [
      'CZ',
      'DE',
      'ES',
      'EU',
      'FI',
      'FR',
      'GB',
      'IE',
      'IT',
      'LT',
      'MA',
      'NL',
      'PL',
      'PT',
      'SN',
      'TN',
    ],
    CA: ['ASIA', 'AU', 'CA', 'QC', 'SG', 'WE', 'WS'],
  },
  ipfo: {
    EU: [
      'BE',
      'CZ',
      'DE',
      'ES',
      'FI',
      'FR',
      'IE',
      'IT',
      'LT',
      'NL',
      'PL',
      'PT',
      'UK',
    ],
    CA: ['CA', 'US'],
  },
};

export const CLOUD_VM_STATE = {
  pending: [
    'BUILD',
    'BUILDING',
    'REBUILD',
    'DELETING',
    'RESIZE',
    'VERIFY_RESIZE',
    'REVERT_RESIZE',
    'MIGRATING',
    'REBOOT',
    'HARD_REBOOT',
    'RESCUING',
    'UNRESCUING',
    'SNAPSHOTTING',
    'RESUMING',
  ],
  openstack: ['PAUSED', 'STOPPED', 'SUSPENDED', 'SHUTOFF', 'RESCUE'],
  error: ['ERROR'],
};

export const CLOUD_UNIT_CONVERSION = {
  KILOBYTE_TO_BYTE: 1000,
  MEGABYTE_TO_BYTE: 1000000,
  GIGABYTE_TO_BYTE: 1000000000,
  GIBIBYTE_TO_BYTE: 1073741824,
};

export const CLOUD_MONITORING = {
  alertingEnabled: false,
  vm: {
    upgradeAlertThreshold: 90,
    period: 'lastweek',
    type: ['mem:used', 'mem:max', 'cpu:used', 'cpu:max', 'net:tx', 'net:rx'],
  },
};

export const CLOUD_PROJECT_OVERVIEW_THRESHOLD = {
  instances: 15,
  ips: 32,
};

export const CLOUD_PROJECT_STATE = {
  creating: 'creating',
  deleting: 'deleting',
  deleted: 'deleted',
  ok: 'ok',
  suspended: 'suspended',
};

export const CLOUD_PROJECT_BILLING_STATE = {
  ACTIVE: 'active',
  TO_RENEW: 'toRenew',
  ERROR: 'error',
  UNPAID: 'unpaid',
  UNRENEWED: 'unrenewed',
  RUPTURE: 'rupture',
  TERMINATED: 'terminated',
};

export const CLOUD_PCA_FILE_STATE = {
  SEALED: 'sealed',
  UNSEALING: 'unsealing',
  UNSEALED: 'unsealed',
  USERNAME: 'pca',
};

export const PCI_URLS = {
  EU: {
    guides: {
      ip_failover: {
        CZ: {
          debian: 'https://www.ovh.co.uk/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh.co.uk/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh.co.uk/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh.co.uk/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh.co.uk/g2046.ip_fail_over_windows',
        },
        DE: {
          debian: 'https://www.ovh.co.uk/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh.co.uk/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh.co.uk/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh.co.uk/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh.co.uk/g2046.ip_fail_over_windows',
        },
        ES: {
          debian: 'https://www.ovh.es/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh.es/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh.es/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh.es/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh.es/g2046.ip_fail_over_windows',
        },
        FI: {
          debian: 'https://www.ovh-hosting.fi/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh-hosting.fi/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh-hosting.fi/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh-hosting.fi/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh-hosting.fi/g2046.ip_fail_over_windows',
        },
        FR: {
          debian:
            'https://www.ovh.com/fr/g2042.configurer_une_ip_fail_over_sur_debian',
          ubuntu:
            'https://www.ovh.com/fr/g2043.configurer_une_ip_fail_over_sur_ubuntu',
          centos:
            'https://www.ovh.com/fr/g2044.configurer_une_ip_fail_over_sur_centos',
          fedora:
            'https://www.ovh.com/fr/g2045.configurer_une_ip_fail_over_sur_fedora',
          windows:
            'https://www.ovh.com/fr/g2046.configurer_une_ip_fail_over_sur_windows',
        },
        GB: {
          debian: 'https://www.ovh.co.uk/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh.co.uk/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh.co.uk/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh.co.uk/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh.co.uk/g2046.ip_fail_over_windows',
        },
        IE: {
          debian: 'https://www.ovh.ie/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh.ie/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh.ie/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh.ie/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh.ie/g2046.ip_fail_over_windows',
        },
        IT: {
          debian: 'https://www.ovh.co.uk/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh.co.uk/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh.co.uk/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh.co.uk/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh.co.uk/g2046.ip_fail_over_windows',
        },
        LT: {
          debian: 'https://www.ovh.lt/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh.lt/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh.lt/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh.lt/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh.lt/g2046.ip_fail_over_windows',
        },
        MA: {
          debian: 'https://www.ovh.ma/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh.ma/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh.ma/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh.ma/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh.ma/g2046.ip_fail_over_windows',
        },
        NL: {
          debian: 'https://www.ovh.nl/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh.nl/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh.nl/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh.nl/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh.nl/g2046.ip_fail_over_windows',
        },
        PL: {
          debian: 'https://www.ovh.pl/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh.pl/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh.pl/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh.pl/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh.pl/g2046.ip_fail_over_windows',
        },
        PT: {
          debian: 'https://www.ovh.pt/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh.pt/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh.pt/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh.pt/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh.pt/g2046.ip_fail_over_windows',
        },
        SN: {
          debian: 'https://www.ovh.sn/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh.sn/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh.sn/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh.sn/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh.sn/g2046.ip_fail_over_windows',
        },
        TN: {
          debian:
            'https://www.ovh.com/tn/g2042.configurer_une_ip_fail_over_sur_debian',
          ubuntu:
            'https://www.ovh.com/tn/g2043.configurer_une_ip_fail_over_sur_ubuntu',
          centos:
            'https://www.ovh.com/tn/g2044.configurer_une_ip_fail_over_sur_centos',
          fedora:
            'https://www.ovh.com/tn/g2045.configurer_une_ip_fail_over_sur_fedora',
          windows:
            'https://www.ovh.com/tn/g2046.configurer_une_ip_fail_over_sur_windows',
        },
        defaultDistribution: 'debian',
      },
      openstack: {
        FR:
          'https://www.ovh.com/fr/publiccloud/guides/g1852.charger_les_variables_denvironnement_openstack',
      },
      xauthtoken: {
        FR:
          'https://www.ovh.com/fr/publiccloud/guides/g1872.gestion_des_tokens',
      },
      vlans: {
        FR: {
          roadmap:
            'https://www.ovh.com/fr/g2148.public_cloud_et_vrack_-_explications_et_roadmap',
          api:
            'https://www.ovh.com/fr/publiccloud/guides/g2162.public_cloud_et_vrack_-_comment_utiliser_le_vrack_et_les_reseaux_prives_avec_les_instances_public_cloud',
        },
      },
    },
    vrack: {
      CZ:
        "https://www.ovh.cz/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      DE:
        "https://www.ovh.de/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      ES:
        "https://www.ovh.es/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      FI:
        "https://www.ovh-hosting.fi/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      FR:
        "https://www.ovh.com/fr/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      GB:
        "https://www.ovh.co.uk/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      IE:
        "https://www.ovh.ie/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      IT:
        "https://www.ovh.it/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      LT:
        "https://www.ovh.lt/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      MA:
        "https://www.ovh.ma/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      NL:
        "https://www.ovh.nl/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      PL:
        "https://www.ovh.pl/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      PT:
        "https://www.ovh.pt/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      SN:
        "https://www.ovh.sn/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      TN:
        "https://www.ovh.com/tn/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
    },
    website_order: {
      vrack: {
        CZ:
          "https://www.ovh.cz/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        DE:
          "https://www.ovh.de/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        ES:
          "https://www.ovh.es/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        FI:
          "https://www.ovh-hosting.fi/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        FR:
          "https://www.ovh.com/fr/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        GB:
          "https://www.ovh.co.uk/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        IE:
          "https://www.ovh.ie/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        IT:
          "https://www.ovh.it/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        LT:
          "https://www.ovh.lt/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        MA:
          "https://www.ovh.ma/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        NL:
          "https://www.ovh.nl/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        PL:
          "https://www.ovh.pl/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        PT:
          "https://www.ovh.pt/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        SN:
          "https://www.ovh.sn/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        TN:
          "https://www.ovh.com/tn/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      },
      pcs: {
        CZ: 'https://www.ovh.cz/public-cloud/storage/object-storage/',
        DE: 'https://www.ovh.de/public-cloud/storage/object-storage/',
        ES: 'https://www.ovh.es/public-cloud/storage/object-storage/',
        FI: 'https://www.ovh-hosting.fi/public-cloud/storage/object-storage/',
        FR: 'https://www.ovh.com/fr/public-cloud/storage/object-storage/',
        GB: 'https://www.ovh.co.uk/public-cloud/storage/object-storage/',
        IE: 'https://www.ovh.ie/public-cloud/storage/object-storage/',
        IT: 'https://www.ovh.it/public-cloud/storage/object-storage/',
        LT: 'https://www.ovh.lt/public-cloud/storage/object-storage/',
        MA: 'https://www.ovh.ma/public-cloud/storage/object-storage/',
        NL: 'https://www.ovh.nl/public-cloud/storage/object-storage/',
        PL: 'https://www.ovh.pl/public-cloud/storage/object-storage/',
        PT: 'https://www.ovh.pt/public-cloud/storage/object-storage/',
        SN: 'https://www.ovh.sn/public-cloud/storage/object-storage/',
        TN: 'https://www.ovh.com/tn/public-cloud/storage/object-storage/',
      },
      pca: {
        CZ: 'https://www.ovh.cz/public-cloud/storage/cloud-archive/',
        DE: 'https://www.ovh.de/public-cloud/storage/cloud-archive/',
        ES: 'https://www.ovh.es/public-cloud/storage/cloud-archive/',
        FI: 'https://www.ovh-hosting.fi/public-cloud/storage/cloud-archive/',
        FR: 'https://www.ovh.com/fr/public-cloud/storage/cloud-archive/',
        GB: 'https://www.ovh.co.uk/public-cloud/storage/cloud-archive/',
        IE: 'https://www.ovh.ie/public-cloud/storage/cloud-archive/',
        IT: 'https://www.ovh.it/public-cloud/storage/cloud-archive/',
        LT: 'https://www.ovh.lt/public-cloud/storage/cloud-archive/',
        MA: 'https://www.ovh.ma/public-cloud/storage/cloud-archive/',
        NL: 'https://www.ovh.nl/public-cloud/storage/cloud-archive/',
        PL: 'https://www.ovh.pl/public-cloud/storage/cloud-archive/',
        PT: 'https://www.ovh.pt/public-cloud/storage/cloud-archive/',
        SN: 'https://www.ovh.sn/public-cloud/storage/cloud-archive/',
        TN: 'https://www.ovh.com/tn/public-cloud/storage/cloud-archive/',
      },
    },
  },
  CA: {
    guides: {
      ip_failover: {
        ASIA: {
          debian: 'https://www.ovh.com/ca/en/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh.com/ca/en/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh.com/ca/en/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh.com/ca/en/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh.com/ca/en/g2046.ip_fail_over_windows',
        },
        IN: {
          debian: 'https://help.ovhcloud.com/csm/en-in-home?id=csm_index',
          ubuntu: 'https://help.ovhcloud.com/csm/en-in-home?id=csm_index',
          centos: 'https://help.ovhcloud.com/csm/en-in-home?id=csm_index',
          fedora: 'https://help.ovhcloud.com/csm/en-in-home?id=csm_index',
          windows: 'https://help.ovhcloud.com/csm/en-in-home?id=csm_index',
        },
        AU: {
          debian: 'https://www.ovh.com/ca/en/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh.com/ca/en/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh.com/ca/en/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh.com/ca/en/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh.com/ca/en/g2046.ip_fail_over_windows',
        },
        CA: {
          debian: 'https://www.ovh.com/ca/en/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh.com/ca/en/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh.com/ca/en/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh.com/ca/en/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh.com/ca/en/g2046.ip_fail_over_windows',
        },
        QC: {
          debian:
            'https://www.ovh.com/ca/fr/g2042.configurer_une_ip_fail_over_sur_debian',
          ubuntu:
            'https://www.ovh.com/ca/fr/g2043.configurer_une_ip_fail_over_sur_ubuntu',
          centos:
            'https://www.ovh.com/ca/fr/g2044.configurer_une_ip_fail_over_sur_centos',
          fedora:
            'https://www.ovh.com/ca/fr/g2045.configurer_une_ip_fail_over_sur_fedora',
          windows:
            'https://www.ovh.com/ca/fr/g2046.configurer_une_ip_fail_over_sur_windows',
        },
        SG: {
          debian: 'https://www.ovh.com/ca/en/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh.com/ca/en/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh.com/ca/en/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh.com/ca/en/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh.com/ca/en/g2046.ip_fail_over_windows',
        },
        WE: {
          debian: 'https://www.ovh.com/ca/en/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh.com/ca/en/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh.com/ca/en/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh.com/ca/en/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh.com/ca/en/g2046.ip_fail_over_windows',
        },
        WS: {
          debian: 'https://www.ovh.com/ca/en/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh.com/ca/en/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh.com/ca/en/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh.com/ca/en/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh.com/ca/en/g2046.ip_fail_over_windows',
        },
        defaultDistribution: 'debian',
      },
      openstack: {
        FR:
          'https://www.ovh.com/fr/publiccloud/guides/g1852.charger_les_variables_denvironnement_openstack',
      },
      xauthtoken: {
        FR:
          'https://www.ovh.com/fr/publiccloud/guides/g1872.gestion_des_tokens',
      },
      vlans: {
        FR: {
          roadmap:
            'https://www.ovh.com/fr/g2148.public_cloud_et_vrack_-_explications_et_roadmap',
        },
      },
    },
    vrack: {
      ASIA:
        "https://ca.ovh.com/asia/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      IN:
        "https://ca.ovh.com/in/order/express/#/express/review?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      AU:
        "https://ca.ovh.com/au/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      CA:
        "https://ca.ovh.com/en/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      QC:
        "https://ca.ovh.com/fr/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      SG:
        "https://ca.ovh.com/sg/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      WE:
        "https://us.ovh.com/us/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      WS:
        "https://us.ovh.com/es/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
    },
    website_order: {
      vrack: {
        ASIA:
          "https://ca.ovh.com/asia/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        IN:
          "https://ca.ovh.com/in/order/express/#/express/review?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        AU:
          "https://ca.ovh.com/au/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        CA:
          "https://ca.ovh.com/en/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        QC:
          "https://ca.ovh.com/fr/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        SG:
          "https://ca.ovh.com/sg/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        WE:
          "https://us.ovh.com/us/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
        WS:
          "https://us.ovh.com/es/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
      },
      pcs: {
        ASIA: 'https://www.ovh.com/asia/public-cloud/storage/object-storage/',
        AU: 'https://www.ovh.com.au/public-cloud/storage/object-storage/',
        CA: 'https://www.ovh.com/ca/en/public-cloud/storage/object-storage/',
        QC: 'https://www.ovh.com/ca/fr/cloud-public/storage/object-storage/',
        SG: 'https://www.ovh.com/sg/public-cloud/storage/object-storage/',
        WE: 'https://www.ovh.com/us/public-cloud/storage/object-storage/',
        WS: 'https://www.ovh.com/us/es/public-cloud/storage/object-storage/',
      },
      pca: {
        ASIA: 'https://www.ovh.com/asia/public-cloud/storage/cloud-archive/',
        AU: 'https://www.ovh.com.au/public-cloud/storage/cloud-archive/',
        CA: 'https://www.ovh.com/ca/en/public-cloud/storage/cloud-archive/',
        QC: 'https://www.ovh.com/ca/fr/cloud-public/storage/cloud-archive/',
        SG: 'https://www.ovh.com/sg/public-cloud/storage/cloud-archive/',
        WE: 'https://www.ovh.com/us/public-cloud/storage/cloud-archive/',
        WS: 'https://www.ovh.com/us/es/public-cloud/storage/cloud-archive/',
      },
    },
  },
  US: {
    guides: {
      ip_failover: {
        US: {
          debian: 'https://www.ovh.com/ca/en/g2042.ip_fail_over_debian',
          ubuntu: 'https://www.ovh.com/ca/en/g2043.ip_fail_over_ubuntu',
          centos: 'https://www.ovh.com/ca/en/g2044.ip_fail_over_centos',
          fedora: 'https://www.ovh.com/ca/en/g2045.ip_fail_over_fedora',
          windows: 'https://www.ovh.com/ca/en/g2046.ip_fail_over_windows',
        },
        defaultDistribution: 'debian',
      },
      openstack: {},
      xauthtoken: {},
      vlans: {},
      ssh: {
        create: {
          US: 'https://support.us.ovhcloud.com/hc/en-us/articles/115001588250',
        },
      },
    },
    vrack: {},
    website_order: {
      'cloud-resell-eu': {
        US: (projectName) =>
          `https://us.ovhcloud.com/order/express/#/express/review?products=~(~(planCode~'project~productId~'cloud~quantity~1~duration~'P1M~configuration~(~(label~'description~values~(~'${encodeURIComponent(
            projectName,
          )})))))`,
      },
      pcs: {
        US:
          'https://support.us.ovhcloud.com/hc/en-us/sections/115000624590-Storage',
      },
      pca: {
        US:
          'https://support.us.ovhcloud.com/hc/en-us/sections/115000624590-Storage',
      },
      vlans: {},
    },
  },
};

export const PCI_SPECIAL_CONDITIONS = {
  CA: {
    fr_FR:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/0a19c8e-Conditions_particulieres_OVH_Stack-FR-11.0.pdf',
    fr_CA:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/0a19c8e-Conditions_particulieres_OVH_Stack-FR-11.0.pdf',
    default:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/d2a208c-Conditions_particulieres_OVH_Stack-WE-9.0.pdf',
  },
  EU: {
    fr_FR:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/0a19c8e-Conditions_particulieres_OVH_Stack-FR-11.0.pdf',
    default:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/d2a208c-Conditions_particulieres_OVH_Stack-WE-9.0.pdf',
  },
  US: {
    default:
      'https://storage.gra.cloud.ovh.net/v1/AUTH_325716a587c64897acbef9a4a4726e38/contracts/d2a208c-Conditions_particulieres_OVH_Stack-WE-9.0.pdf',
  },
};

export const TRACKING_CLOUD = {
  pci_menu_header_instances: 'cloud::pci::menu::instances',
  pci_menu_header_ssh_keys: 'cloud::pci::menu::ssh_keys',
  pci_menu_header_snapshots: 'cloud::pci::menu::snapshots',
  pci_menu_header_volume: 'cloud::pci::menu::additional_drives',
  pci_menu_header_storage: 'cloud::pci::menu::storage',
  pci_menu_header_openstack_users: 'cloud::pci::menu::openstack_users',
  pci_menu_header_quota: 'cloud::pci::menu::quota',
  pci_menu_header_regions: 'cloud::pci::menu::add_localisations',
  pci_menu_header_consumption: 'cloud::pci::menu::consumption',
  pci_menu_header_billing_history: 'cloud::pci::menu::billing_history',
  pci_menu_header_credits: 'cloud::pci::menu::credits_and_vouchers',
  pci_menu_header_contracts: 'cloud::pci::menu::contracts',
};

const changelogLinks = {
  compute: {
    changelog:
      'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Public+Cloud+Compute',
    roadmap:
      'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Public+Cloud+Compute',
    'feature-request':
      'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
  },
  storage: {
    changelog:
      'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Public+Cloud+Storage',
    roadmap:
      'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Public+Cloud+Storage',
    'feature-request':
      'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
  },
  default: {
    changelog: 'https://github.com/orgs/ovh/projects/16/views/6?pane=info',
    roadmap: 'https://github.com/orgs/ovh/projects/16/views/1?pane=info',
    'feature-request':
      'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
  },
  network: {
    changelog:
      'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Public+Cloud+Networking',
    roadmap:
      'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Public+Cloud+Networking',
    'feature-request':
      'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
  },
  rancher: {
    changelog:
      'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Managed+Rancher+Service',
    roadmap:
      'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Managed+Rancher+Service',
    'feature-request':
      'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
  },
  kubernetes: {
    changelog:
      'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Managed+Kubernetes+Service',
    roadmap:
      'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Managed+Kubernetes+Service',
    'feature-request':
      'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
  },
  private_registry: {
    changelog:
      'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Managed+Private+Registry',
    roadmap:
      'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Managed+Private+Registry',
    'feature-request':
      'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
  },
  databases: {
    changelog:
      'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Managed+Databases',
    roadmap:
      'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Managed+Databases',
    'feature-request':
      'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
  },
  data_processing: {
    changelog:
      'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Data+Processing',
    roadmap:
      'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Data+Processing',
    'feature-request':
      'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
  },
  data_platform: {
    changelog:
      'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Data+Platform',
    roadmap:
      'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Data+Platform',
    'feature-request':
      'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
  },
  log_data_platform: {
    changelog:
      'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Logs+Data+Platform',
    roadmap:
      'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Logs+Data+Platform',
    'feature-request':
      'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
  },
  ai_tools: {
    changelog:
      'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=AI+Tools',
    roadmap:
      'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=AI+Tools',
    'feature-request':
      'https://github.com/ovh/management-security-operations-roadmap/issues/new',
  },
  ai_notebooks: {
    changelog:
      'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=AI+Notebooks',
    roadmap:
      'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=AI+Notebooks',
    'feature-request':
      'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
  },
  ai_training: {
    changelog:
      'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=AI+Training',
    roadmap:
      'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=AI+Training',
    'feature-request':
      'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
  },
  ai_deploy: {
    changelog:
      'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=AI+Deploy',
    roadmap:
      'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=AI+Deploy',
    'feature-request':
      'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
  },
};

export const CHANGELOG = {
  instances: {
    links: changelogLinks.compute,
    chapters: ['PublicCloud', 'compute', 'instances'],
  },
  object_storage: {
    links: changelogLinks.storage,
    chapters: ['PublicCloud', 'storages', 'objects_storage_container'],
  },
  cloud_archive: {
    links: changelogLinks.storage,
    chapters: ['PublicCloud', 'storages', 'cloud_archives_container'],
  },
  cold_archive: {
    links: changelogLinks.storage,
    chapters: ['PublicCloud', 'storages', 'cold_archive'],
  },
  volume_snapshot: {
    links: changelogLinks.default,
    chapters: ['PublicCloud', 'storages', 'volume_snapshot'],
  },
  volume_backup: {
    links: changelogLinks.default,
    chapters: ['PublicCloud', 'storages', 'volume-backup'],
  },
  instance_backup: {
    links: changelogLinks.default,
    chapters: ['PublicCloud', 'storages', 'instance-backups'],
  },
  load_balancer: {
    links: changelogLinks.network,
    chapters: ['PublicCloud', 'network', 'octavia-loadbalancer'],
  },
  data_streaming: {
    links: changelogLinks.databases,
    chapters: ['PublicCloud', 'databases_analytics', 'data_streaming'],
  },
  data_processing: {
    links: changelogLinks.data_processing,
    chapters: ['PublicCloud', 'databases_analytics', 'data_processing'],
  },
  data_analysis: {
    links: changelogLinks.databases,
    chapters: ['PublicCloud', 'databases_analytics', 'data_analysis'],
  },
  logs_data_platform: {
    links: changelogLinks.logs_data_platform,
    chapters: ['PublicCloud', 'databases_analytics', 'logs_data_platorm'],
  },
  ai_dashboard: {
    links: changelogLinks.ai_tools,
    chapters: ['PublicCloud', 'ai_machine_learning', 'ai_dashboard'],
  },
  ai_notebooks: {
    links: changelogLinks.ai_notebooks,
    chapters: ['PublicCloud', 'ai_machine_learning', 'ai_notebooks'],
  },
  ai_training: {
    links: changelogLinks.ai_training,
    chapters: ['PublicCloud', 'ai_machine_learning', 'ai_training'],
  },
  ai_deploy: {
    links: changelogLinks.ai_deploy,
    chapters: ['PublicCloud', 'ai_machine_learning', 'ai_deploy'],
  },
  quota_and_regions: {
    links: changelogLinks.default,
    chapters: ['PublicCloud', 'project_management', 'quota'],
  },
  contacts: {
    links: changelogLinks.default,
    chapters: ['PublicCloud', 'project_management', 'contacts_rights'],
  },
  edit: {
    links: changelogLinks.default,
    chapters: ['PublicCloud', 'project_management', 'project'],
  },
};

export default {
  CHANGELOG,
  CLOUD_INSTANCE_DEFAULTS,
  CLOUD_INSTANCE_DEFAULT_FALLBACK,
  CLOUD_FLAVOR_SPECIFIC_IMAGE,
  CLOUD_INSTANCE_HAS_GUARANTEED_RESSOURCES,
  CLOUD_VOLUME_TYPES,
  CLOUD_IPFO_ORDER_LIMIT,
  CLOUD_GEOLOCALISATION,
  CLOUD_VM_STATE,
  CLOUD_UNIT_CONVERSION,
  CLOUD_MONITORING,
  CLOUD_PROJECT_OVERVIEW_THRESHOLD,
  CLOUD_PROJECT_STATE,
  CLOUD_PROJECT_BILLING_STATE,
  CLOUD_PCA_FILE_STATE,
  PCI_URLS,
  PCI_SPECIAL_CONDITIONS,
  TRACKING_CLOUD,
  TAGS_BLOB,
  FLOATINGIP_ADDON_FAMILY,
  FLOATINGIP_PLANCODE,
  BETA,
};
