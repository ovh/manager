// CA eq to en_CA
// QC eq to fr_CA
// WS eq to es_US
// AU eq to en_CA
// SG eq to en_GB
// ASIA eq to en_GB

export const URLS = {
  support: {
    ASIA: 'https://www.ovh.com/asia/support/',
    AU: 'https://www.ovh.com.au/support/',
    CA: 'https://www.ovh.co.uk/support/',
    QC: 'https://www.ovh.com/fr/support/',
    SG: 'https://www.ovh.com/sg/support/',
    WE: 'https://www.ovh.co.uk/support/',
    WS: 'https://www.ovh.com/fr/support/',
  },
  support_contact: {
    ASIA: 'https://www.ovh.com/asia/support/',
    AU: 'https://www.ovh.com.au/support/',
    CA: 'https://www.ovh.com/ca/en/support/',
    QC: 'https://www.ovh.com/ca/fr/support/',
    SG: 'https://www.ovh.com/sg/support/',
    WE: 'https://www.ovh.com/ca/en/support/',
    WS: 'https://www.ovh.com/ca/en/support/',
  },
  website_order: {
    vps: {
      ASIA: 'https://www.ovh.com/asia/vps/',
      AU: 'https://www.ovh.com.au/vps/',
      CA: 'https://www.ovh.com/ca/en/vps/',
      QC: 'https://www.ovh.com/ca/fr/vps/',
      SG: 'https://www.ovh.com/sg/vps/',
      WE: 'https://www.ovh.com/us/vps/',
      WS: 'https://www.ovh.com/us/es/vps/',
    },
    dedicated_server: {
      ASIA: 'https://www.ovh.com/asia/dedicated-servers/',
      AU: 'https://www.ovh.com.au/dedicated-servers/',
      CA: 'https://www.ovh.com/ca/en/dedicated-servers/',
      QC: 'https://www.ovh.com/ca/fr/serveurs-dedies/',
      SG: 'https://www.ovh.com/sg/dedicated-servers/',
      WE: 'https://www.ovh.com/us/dedicated-servers/',
      WS: 'https://www.ovh.com/us/es/servidores-dedicados/',
    },
    dedicated_cloud: {
      ASIA: 'https://www.ovh.com/asia/private-cloud/',
      AU: 'https://www.ovh.com.au/private-cloud/',
      CA: 'https://www.ovh.com/ca/en/dedicated-cloud/',
      QC: 'https://www.ovh.com/ca/fr/cloud-dedie/',
      SG: 'https://www.ovh.com/sg/private-cloud/',
      WE: 'https://www.ovh.com/us/dedicated-cloud/',
      WS: 'https://www.ovh.com/us/es/dedicated-cloud/',
    },
    load_balancer: {
      ASIA: 'https://www.ovh.com/asia/solutions/ip-load-balancing/',
      AU: 'https://www.ovh.com.au/solutions/ip-load-balancing/',
      CA: 'https://www.ovh.com/ca/en/solutions/ip-load-balancing/',
      QC: 'https://www.ovh.com/ca/fr/solutions/ip-load-balancing/',
      SG: 'https://www.ovh.com/sg/solutions/ip-load-balancing/',
      WE: 'https://www.ovh.com/us/solutions/ip-load-balancing/',
      WS: 'https://www.ovh.com/us/es/soluciones/ip-load-balancing/',
    },
    vrack: {
      ASIA:
        "https://ca.ovh.com/asia/order/express/#/new/express/resume?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
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
    veeam: {},
    veeam_enterprise: {
      CA: 'https://www.ovh.com/ca/en/storage-solutions/veeam-enterprise.xml',
      QC: 'https://www.ovh.com/ca/fr/storage-solutions/veeam-enterprise.xml',
    },
    cloud_disk_array: {},
    cloud_desktop: {},
    dbaas_logs: {
      CA:
        "https://ca.ovh.com/en/order/express/#/new/express/resume?products=~(~(planCode~'logs-basic~productId~'logs))",
      QC:
        "https://ca.ovh.com/fr/order/express/#/new/express/resume?products=~(~(planCode~'logs-basic~productId~'logs))",
      WE:
        "https://us.ovh.com/us/order/express/#/new/express/resume?products=~(~(planCode~'logs-basic~productId~'logs))",
      WS:
        "https://us.ovh.com/es/order/express/#/new/express/resume?products=~(~(planCode~'logs-basic~productId~'logs))",
    },
    express_base: {
      ASIA: 'https://ca.ovh.com/asia/order/express/#/new/express/resume',
      AU: 'https://ca.ovh.com/au/order/express/#/new/express/resume',
      CA: 'https://ca.ovh.com/en/order/express/#/new/express/resume',
      QC: 'https://ca.ovh.com/fr/order/express/#/new/express/resume',
      SG: 'https://ca.ovh.com/sg/order/express/#/new/express/resume',
      WE: 'https://us.ovh.com/us/order/express/#/new/express/resume',
      WS: 'https://us.ovh.com/es/order/express/#/new/express/resume',
    },
    express_review_base: {
      ASIA: 'https://ca.ovh.com/asia/order/express/#/express/review',
      AU: 'https://ca.ovh.com/au/order/express/#/express/review',
      CA: 'https://ca.ovh.com/en/order/express/#/express/review',
      QC: 'https://ca.ovh.com/fr/order/express/#/express/review',
      SG: 'https://ca.ovh.com/sg/order/express/#/express/review',
      WE: 'https://us.ovh.com/us/order/express/#/express/review',
      WS: 'https://us.ovh.com/es/order/express/#/express/review',
    },
  },
  guides: {
    home: {
      ASIA: 'https://docs.ovh.com/ca/en/',
      AU: 'https://docs.ovh.com/ca/en/',
      CA: 'https://docs.ovh.com/ca/en/',
      QC: 'https://docs.ovh.com/ca/fr/',
      SG: 'https://docs.ovh.com/ca/en/',
      WE: 'https://docs.ovh.com/ca/en/',
      WS: 'https://docs.ovh.com/ca/en/',
    },
    cda: 'storage/',
    ip_failover: {
      ASIA: {
        debian: 'https://www.ovh.com/ca/en/g2042.ip_fail_over_debian',
        ubuntu: 'https://www.ovh.com/ca/en/g2043.ip_fail_over_ubuntu',
        centos: 'https://www.ovh.com/ca/en/g2044.ip_fail_over_centos',
        fedora: 'https://www.ovh.com/ca/en/g2045.ip_fail_over_fedora',
        windows: 'https://www.ovh.com/ca/en/g2046.ip_fail_over_windows',
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
      FR: 'https://www.ovh.com/fr/publiccloud/guides/g1872.gestion_des_tokens',
    },
    vmResize: {
      FR:
        'https://www.ovh.com/fr/publiccloud/guides/g1778.redimensionner_une_instance#redimensionner_une_instance_redimensionnement_du_disque_sous_windows',
    },
    cloud: {
      FR: 'https://docs.ovh.com/fr/fr/cloud/',
      IT: 'https://www.ovh.it/g1785.cloud',
      ES: 'https://www.ovh.es/g1785.cloud',
      PL: 'https://www.ovh.pl/g1785.cloud',
    },
    vlans: {
      FR: {
        roadmap:
          'https://www.ovh.com/fr/g2148.public_cloud_et_vrack_-_explications_et_roadmap',
        api:
          'https://www.ovh.com/fr/publiccloud/guides/g2162.public_cloud_et_vrack_-_comment_utiliser_le_vrack_et_les_reseaux_prives_avec_les_instances_public_cloud',
      },
    },
    vrack: {
      FR: {
        roadmap:
          'https://www.ovh.com/fr/g2148.public_cloud_et_vrack_-_explications_et_roadmap',
      },
    },
    rCloneFile: {
      AU: 'https://docs.ovh.com/au/en/storage/sync-rclone-object-storage/',
      QC: 'https://docs.ovh.com/ca/fr/storage/sync-rclone-object-storage/',
      CA: 'https://docs.ovh.com/ca/en/storage/sync-rclone-object-storage/',
    },
  },
};

export default { URLS };
