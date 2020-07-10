export const REDIRECT_URLS = {
  support: 'https://www.ovh.com/manager/dedicated/index.html#/ticket',
  billing: 'https://www.ovh.com/manager/dedicated/index.html#/billing/history',
  billingPayments:
    'https://www.ovh.com/manager/dedicated/index.html#/billing/payments',
  billingMean: 'https://www.ovh.com/manager/dedicated/index.html#/billing/mean',
  billingVouchers:
    'https://www.ovh.com/manager/dedicated/index.html#/billing/vouchers',
  billingRefunds:
    'https://www.ovh.com/manager/dedicated/index.html#/billing/refunds',
  billingFidelity:
    'https://www.ovh.com/manager/dedicated/index.html#/billing/fidelity',
  billingCredits:
    'https://www.ovh.com/manager/dedicated/index.html#/billing/credits',
  ordersInProgress:
    'https://www.ovh.com/manager/dedicated/index.html#/billing/orders?status=in-progress',
  orders:
    'https://www.ovh.com/manager/dedicated/index.html#/billing/orders?status=all',
  services:
    'https://www.ovh.com/manager/dedicated/index.html#/billing/autoRenew',
  servicesAgreements:
    'https://www.ovh.com/manager/dedicated/index.html#/useraccount/agreements',
  paymentMeans:
    'https://www.ovh.com/manager/dedicated/index.html#/billing/mean',
  addCreditCard:
    'https://www.ovh.com/manager/dedicated/index.html#/billing/mean/add?meanType=creditCard',
  ovhAccount:
    'https://www.ovh.com/manager/dedicated/index.html#/billing/ovhaccount',
  debtAccount:
    'https://www.ovh.com/manager/dedicated/index.html#/billing/statements',
  userInfos:
    'https://www.ovh.com/manager/dedicated/index.html#/useraccount/infos',
  userSecurity:
    'https://www.ovh.com/manager/dedicated/index.html#/useraccount/security',
  userEmails:
    'https://www.ovh.com/manager/dedicated/index.html#/useraccount/emails',
  userSubscriptions:
    'https://www.ovh.com/manager/dedicated/index.html#/useraccount/subscriptions',
  userSSH: 'https://www.ovh.com/manager/dedicated/index.html#/useraccount/ssh',
  userAdvanced:
    'https://www.ovh.com/manager/dedicated/index.html#/useraccount/advanced',
  contacts:
    'https://www.ovh.com/manager/dedicated/index.html#/useraccount/contacts?tab=SERVICES&serviceName={serviceName}',
  horizon:
    'https://horizon.cloud.ovh.net/openstackdashboard?username={username}',
  ipAction:
    'https://www.ovh.com/manager/dedicated/index.html#/configuration/ip?action={action}&ip={ip}&ipBlock={ipBlock}',
  vRack:
    'https://www.ovh.com/manager/dedicated/index.html#/configuration/vrack?landingTo=networks',
  nas:
    'https://www.ovh.com/manager/dedicated/index.html#/configuration/nas?landingTo=networks',
  nasPage:
    'https://www.ovh.com/manager/dedicated/index.html#/configuration/nas/nas/nas_{nas}?landingTo=networks',
  ip:
    'https://www.ovh.com/manager/dedicated/index.html#/configuration/ip?landingTo=ip',
  license:
    'https://www.ovh.com/manager/dedicated/index.html#/configuration/license?landingTo=licences',
  housing:
    'https://www.ovh.com/manager/dedicated/index.html#/configuration/housing/{housing}?landingTo=dedicatedServers',
  dedicatedServers:
    'https://www.ovh.com/manager/dedicated/index.html#/configuration?landingTo=dedicatedServers',
  dedicatedServersPage:
    'https://www.ovh.com/manager/dedicated/index.html#/configuration/server/{server}?landingTo=dedicatedServers',
  dedicatedCloud:
    'https://www.ovh.com/manager/dedicated/index.html#/configuration?landingTo=dedicatedClouds',
  dedicatedCloudPage:
    'https://www.ovh.com/manager/dedicated/index.html#/configuration/dedicated_cloud/{pcc}?landingTo=dedicatedClouds',
  cloudDesktop: 'https://www.ovh.com/manager/sunrise/index.html#/deskaas',
  vps:
    'https://www.ovh.com/manager/dedicated/index.html#/configuration?landingTo=vps',
  vpsPage:
    'https://www.ovh.com/manager/dedicated/index.html#/configuration/vps/{vps}?landingTo=vps',
  cdnPage:
    'https://www.ovh.com/manager/dedicated/index.html#/configuration/cdn/{cdn}?landingTo=networks',
  renew:
    'https://www.ovh.com/manager/dedicated/index.html#/billing/autoRenew?selectedType={serviceType}&searchText={serviceName}',
  licensePage:
    'https://www.ovh.com/manager/dedicated/index.html#/configuration/license/{license}/detail',
};

export const URLS = {
  agreements: {
    US: {
      termsOfService: 'https://us.ovhcloud.com/legal/terms-of-service',
      privacyPolicy: 'https://us.ovhcloud.com/legal/privacy-policy',
    },
  },
  changeOwner: {
    CZ: 'https://www.ovh.cz/cgi-bin/procedure/procedureChangeOwner.cgi',
    DE: 'https://www.ovh.de/cgi-bin/procedure/procedureChangeOwner.cgi',
    ES: 'https://www.ovh.es/cgi-bin/procedure/procedureChangeOwner.cgi',
    FI: 'https://www.ovh.com/cgi-bin/fi/procedure/procedureChangeOwner.cgi',
    FR: 'https://www.ovh.com/cgi-bin/fr/procedure/procedureChangeOwner.cgi',
    GB: 'https://www.ovh.co.uk/cgi-bin/procedure/procedureChangeOwner.cgi',
    IE: 'https://www.ovh.ie/cgi-bin/procedure/procedureChangeOwner.cgi',
    IT: 'https://www.ovh.it/cgi-bin/procedure/procedureChangeOwner.cgi',
    LT: 'https://www.ovh.com/cgi-bin/lt/procedure/procedureChangeOwner.cgi',
    MA: 'https://www.ovh.ma/cgi-bin/procedure/procedureChangeOwner.cgi',
    NL: 'https://www.ovh.nl/cgi-bin/procedure/procedureChangeOwner.cgi',
    PL: 'https://www.ovh.pl/cgi-bin/procedure/procedureChangeOwner.cgi',
    PT: 'https://www.ovh.pt/cgi-bin/procedure/procedureChangeOwner.cgi',
    SN: 'https://www.ovh.sn/cgi-bin/procedure/procedureChangeOwner.cgi',
    TN: 'https://www.ovh.com/tn/cgi-bin/procedure/procedureChangeOwner.cgi',
  },
  support: {
    CZ: 'http://www.ovh.cz/podpora/',
    DE: 'http://www.ovh.de/support/',
    ES: 'http://www.ovh.es/soporte/',
    FI: 'http://www.ovh-hosting.fi/tuki/',
    FR: 'https://www.ovh.com/fr/support/',
    GB: 'http://www.ovh.co.uk/support/',
    IE: 'http://www.ovh.ie/support/',
    IT: 'http://www.ovh.it/supporto/',
    LT: 'http://www.ovh.lt/pagalba/',
    MA: 'https://www.ovh.ma/support/',
    NL: 'http://www.ovh.nl/support/',
    PL: 'https://www.ovh.pl/pomoc/',
    PT: 'https://www.ovh.pt/suporte/',
    SN: 'https://www.ovh.sn/support/',
    TN: 'https://www.ovh.com/tn/support/',
  },
  support_contact: {
    CZ: 'http://www.ovh.cz/podpora/',
    DE: 'http://www.ovh.de/support/',
    ES: 'http://www.ovh.es/soporte/',
    FI: 'http://www.ovh-hosting.fi/tuki/',
    FR: 'https://www.ovh.com/fr/support/nous-contacter/',
    GB: 'http://www.ovh.co.uk/support/',
    IE: 'http://www.ovh.ie/support/',
    IT: 'http://www.ovh.it/supporto/',
    LT: 'http://www.ovh.lt/pagalba/',
    MA: 'https://www.ovh.ma/support/',
    NL: 'http://www.ovh.nl/support/',
    PL: 'https://www.ovh.pl/pomoc/',
    PT: 'https://www.ovh.pt/suporte/',
    SN: 'https://www.ovh.sn/support/',
    TN: 'https://www.ovh.com/tn/support/',
  },
  website_order: {
    vps: {
      CZ: 'https://www.ovh.cz/vps/',
      DE: 'https://www.ovh.de/virtual_server/',
      ES: 'https://www.ovh.es/vps/',
      FI: 'https://www.ovh-hosting.fi/vps/',
      FR: 'https://www.ovh.com/fr/vps/',
      GB: 'https://www.ovh.co.uk/vps/',
      IE: 'https://www.ovh.ie/vps/',
      IT: 'https://www.ovh.it/vps/',
      LT: 'https://www.ovh.lt/vps/',
      MA: 'https://www.ovh.ma/vps/',
      NL: 'https://www.ovh.nl/vps/',
      PL: 'https://www.ovh.pl/vps/',
      PT: 'https://www.ovh.pt/vps/',
      SN: 'https://www.ovh.sn/vps/',
      TN: 'https://www.ovh.com/tn/vps/',
    },
    dedicated_server: {
      CZ: 'https://www.ovh.cz/dedikovane_servery/',
      DE: 'https://www.ovh.de/dedicated_server/',
      ES: 'https://www.ovh.es/servidores_dedicados/',
      FI: 'https://www.ovh-hosting.fi/dedikoidut_palvelimet/',
      FR: 'https://www.ovh.com/fr/serveurs_dedies/',
      GB: 'https://www.ovh.co.uk/dedicated_servers/',
      IE: 'https://www.ovh.ie/dedicated_servers/',
      IT: 'https://www.ovh.it/server_dedicati/',
      LT: 'https://www.ovh.lt/dedikuoti_serveriai/',
      MA: 'https://www.ovh.ma/serveurs_dedies/',
      NL: 'https://www.ovh.nl/dedicated_servers/',
      PL: 'https://www.ovh.pl/serwery_dedykowane/',
      PT: 'https://www.ovh.pt/servidores_dedicados/',
      SN: 'https://www.ovh.sn/serveurs_dedies/',
      TN: 'https://www.ovh.com/tn/serveurs_dedies/',
    },
    dedicated_cloud: {
      CZ: 'https://www.ovh.cz/dedicated-cloud/',
      DE: 'https://www.ovh.de/dedicated-cloud/',
      ES: 'https://www.ovh.es/dedicated-cloud/',
      FI: 'https://www.ovh-hosting.fi/dedicated-cloud/',
      FR: 'https://www.ovh.com/fr/dedicated-cloud/',
      GB: 'https://www.ovh.co.uk/dedicated-cloud/',
      IE: 'https://www.ovh.ie/dedicated-cloud/',
      IT: 'https://www.ovh.it/dedicated-cloud/',
      LT: 'https://www.ovh.lt/dedicated-cloud/',
      MA: 'https://www.ovh.ma/dedicated-cloud/',
      NL: 'https://www.ovh.nl/dedicated-cloud/',
      PL: 'https://www.ovh.pl/dedicated-cloud/',
      PT: 'https://www.ovh.pt/dedicated-cloud/',
      SN: 'https://www.ovh.sn/dedicated-cloud/',
      TN: 'https://www.ovh.com/tn/dedicated-cloud/',
    },
    load_balancer: {
      CZ: 'https://www.ovh.cz/reseni/ip-load-balancing/',
      DE: 'https://www.ovh.de/loesungen/ip-load-balancing/',
      ES: 'https://www.ovh.es/soluciones/ip-load-balancing/',
      FI: 'https://www.ovh-hosting.fi/ratkaisut/ip-load-balancing/',
      FR: 'https://www.ovh.com/fr/solutions/ip-load-balancing/',
      GB: 'https://www.ovh.co.uk/solutions/ip-load-balancing/',
      IE: 'https://www.ovh.ie/solutions/ip-load-balancing/',
      IT: 'https://www.ovh.it/soluzioni/ip-load-balancing/',
      LT: 'https://www.ovh.lt/sprendimai/ip-load-balancing/',
      MA: 'https://www.ovh.ma/solutions/ip-load-balancing/',
      NL: 'https://www.ovh.nl/oplossing/ip-load-balancing/',
      PL: 'https://www.ovh.pl/rozwiazania/ip-load-balancing/',
      PT: 'https://www.ovh.pt/solucoes/ip-load-balancing/',
      SN: 'https://www.ovh.sn/solutions/ip-load-balancing/',
      TN: 'https://www.ovh.com/tn/solutions/ip-load-balancing/',
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
    veeam: {
      FR: 'https://www.ovh.com/fr/storage-solutions/veeam-cloud-connect/',
    },
    cloud_disk_array: {
      FR: 'https://www.ovh.com/fr/cloud/cloud-disk-array/',
    },
    cloud_desktop: {
      CZ: 'https://www.ovh.cz/cloud/cloud-desktop/',
      DE: 'https://www.ovh.de/cloud/cloud-desktop/',
      ES: 'https://www.ovh.es/cloud/cloud-desktop/',
      FI: 'https://www.ovh-hosting.fi/cloud/cloud-desktop/',
      FR: 'https://www.ovh.com/fr/cloud/cloud-desktop/',
      GB: 'https://www.ovh.co.uk/cloud/cloud-desktop/',
      IE: 'https://www.ovh.ie/cloud/cloud-desktop/',
      IT: 'https://www.ovh.it/cloud/cloud-desktop/',
      LT: 'https://www.ovh.lt/cloud/cloud-desktop/',
      MA: 'https://www.ovh.ma/cloud/cloud-desktop/',
      NL: 'https://www.ovh.nl/cloud/cloud-desktop/',
      PL: 'https://www.ovh.pl/cloud/cloud-desktop/',
      PT: 'https://www.ovh.pt/cloud/cloud-desktop/',
      SN: 'https://www.ovh.sn/cloud/cloud-desktop/',
      TN: 'https://www.ovh.com/tn/cloud/cloud-desktop/',
    },
    dbaas_logs: {
      FR:
        "https://www.ovh.com/fr/order/express/#/new/express/resume?products=~(~(planCode~'logs-basic~productId~'logs))",
      CZ:
        "https://www.ovh.cz/order/express/#/new/express/resume?products=~(~(planCode~'logs-basic~productId~'logs))",
      DE:
        "https://www.ovh.de/order/express/#/new/express/resume?products=~(~(planCode~'logs-basic~productId~'logs))",
      ES:
        "https://www.ovh.es/order/express/#/new/express/resume?products=~(~(planCode~'logs-basic~productId~'logs))",
      FI:
        "https://www.ovh-hosting.fi/order/express/#/new/express/resume?products=~(~(planCode~'logs-basic~productId~'logs))",
      GB:
        "https://www.ovh.co.uk/order/express/#/new/express/resume?products=~(~(planCode~'logs-basic~productId~'logs))",
      IE:
        "https://www.ovh.ie/order/express/#/new/express/resume?products=~(~(planCode~'logs-basic~productId~'logs))",
      IT:
        "https://www.ovh.it/order/express/#/new/express/resume?products=~(~(planCode~'logs-basic~productId~'logs))",
      LT:
        "https://www.ovh.lt/order/express/#/new/express/resume?products=~(~(planCode~'logs-basic~productId~'logs))",
      MA:
        "https://www.ovh.ma/order/express/#/new/express/resume?products=~(~(planCode~'logs-basic~productId~'logs))",
      NL:
        "https://www.ovh.nl/order/express/#/new/express/resume?products=~(~(planCode~'logs-basic~productId~'logs))",
      PL:
        "https://www.ovh.pl/order/express/#/new/express/resume?products=~(~(planCode~'logs-basic~productId~'logs))",
      PT:
        "https://www.ovh.pt/order/express/#/new/express/resume?products=~(~(planCode~'logs-basic~productId~'logs))",
      SN:
        "https://www.ovh.sn/order/express/#/new/express/resume?products=~(~(planCode~'logs-basic~productId~'logs))",
      TN:
        "https://www.ovh.com/tn/order/express/#/new/express/resume?products=~(~(planCode~'logs-basic~productId~'logs))",
    },
  },
  guides: {
    home: {
      CZ: 'https://docs.ovh.com/cz/cs/',
      DE: 'https://docs.ovh.com/de/',
      ES: 'https://docs.ovh.com/es/',
      FI: 'https://docs.ovh.com/fi/',
      FR: 'https://docs.ovh.com/fr/',
      GB: 'https://docs.ovh.com/gb/en/',
      IE: 'https://docs.ovh.com/ie/en/',
      IT: 'https://docs.ovh.com/it/',
      LT: 'https://docs.ovh.com/lt/',
      MA: 'https://docs.ovh.com/fr/',
      NL: 'https://docs.ovh.com/nl/',
      PL: 'https://docs.ovh.com/pl/',
      PT: 'https://docs.ovh.com/pt/',
      SN: 'https://docs.ovh.com/fr/',
      TN: 'https://docs.ovh.com/fr/',
    },
    cda: 'storage/',
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
      MA: 'https://www.ovh.ma/g1785.cloud',
      PL: 'https://www.ovh.pl/g1785.cloud',
      SN: 'https://www.ovh.sn/g1785.cloud',
      TN: 'https://docs.ovh.com/tn/fr/cloud/',
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
      FR: 'https://docs.ovh.com/fr/storage/sync-rclone-object-storage/',
      PL: 'https://docs.ovh.com/pl/storage/sync-rclone-object-storage/',
      GB: 'https://docs.ovh.com/gb/en/storage/sync-rclone-object-storage/',
      DE: 'https://docs.ovh.com/de/storage/sync-rclone-object-storage/',
      IT: 'https://docs.ovh.com/it/storage/sync-rclone-object-storage/',
      FI: 'https://docs.ovh.com/fi/storage/sync-rclone-object-storage/',
      IE: 'https://docs.ovh.com/ie/en/storage/sync-rclone-object-storage/',
    },
    overTheBox: 'https://docs.ovh.com/display/public/CRXDSL/Accueil+xDSL',
  },
  overTheBoxManager: 'http://overthebox.ovh',
  orderExpressLite: 'https://www.ovhtelecom.fr/adsl/express-lite/',
  orderBoost: 'https://www.ovhtelecom.fr/adsl/offres-de-connexion.xml',
  keyGenHelp: 'https://www.ovh.com/fr/g1769.creation_des_cles_ssh',
};

export const MANAGER_URLS = {
  CA: {
    dedicated: 'https://ca.ovh.com/manager/dedicated',
    publicCloud: 'https://ca.ovh.com/manager/public-cloud',
    repsac: 'https://ca.ovh.com/manager/cloud/repsac',
    cloud: 'https://ca.ovh.com/manager/cloud/repsac',
    sunrise: 'https://ca.ovh.com/manager/sunrise',
  },
  EU: {
    dedicated: 'https://www.ovh.com/manager/dedicated',
    publicCloud: 'https://www.ovh.com/manager/public-cloud',
    repsac: 'https://www.ovh.com/manager/cloud/repsac',
    cloud: 'https://www.ovh.com/manager/cloud/repsac',
    sunrise: 'https://www.ovh.com/manager/sunrise',
    telecom: 'https://www.ovhtelecom.fr/manager',
    web: 'https://www.ovh.com/manager/web',
  },
  US: {
    dedicated: 'https://us.ovhcloud.com/manager/dedicated',
    publicCloud: 'https://us.ovhcloud.com/manager/public-cloud',
    repsac: 'https://us.ovhcloud.com/manager/cloud/repsac',
    cloud: 'https://us.ovhcloud.com/manager/cloud/repsac',
  },
};

export default {
  MANAGER_URLS,
  REDIRECT_URLS,
  URLS,
};
