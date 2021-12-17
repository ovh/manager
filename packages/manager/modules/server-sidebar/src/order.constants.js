import { DEDICATED } from './constants';

export const ORDER_URLS = {
  EU: {
    DEDICATED: {
      FR: 'https://www.ovh.com/manager/dedicated/',
    },
    dedicated_cloud: {
      DE:
        'https://www.ovhcloud.com/de/enterprise/products/hosted-private-cloud/prices/',
      ES:
        'https://www.ovhcloud.com/es-es/enterprise/products/hosted-private-cloud/prices/',
      FR:
        'https://www.ovhcloud.com/fr/enterprise/products/hosted-private-cloud/prices/',
      GB:
        'https://www.ovhcloud.com/en-gb/enterprise/products/hosted-private-cloud/prices/',
      IE:
        'https://www.ovhcloud.com/en-ie/enterprise/products/hosted-private-cloud/prices/',
      IT:
        'https://www.ovhcloud.com/it/enterprise/products/hosted-private-cloud/prices/',
      LT:
        'https://www.ovhcloud.com/en-ie/enterprise/products/hosted-private-cloud/prices/',
      MA:
        'https://www.ovh.com/ma/enterprise/products/hosted-private-cloud/prices/',
      NL:
        'https://www.ovhcloud.com/nl/enterprise/products/hosted-private-cloud/prices/',
      PL:
        'https://www.ovhcloud.com/pl/enterprise/products/hosted-private-cloud/prices/',
      PT:
        'https://www.ovhcloud.com/pt/enterprise/products/hosted-private-cloud/prices/',
      SN:
        'https://www.ovhcloud.com/fr-sn/enterprise/products/hosted-private-cloud/prices/',
      TN:
        'https://www.ovhcloud.com/fr-tn/enterprise/products/hosted-private-cloud/prices/',
    },
    managed_bare_metal: {
      CZ: 'https://www.ovhcloud.com/en-ie/managed-bare-metal/',
      DE: 'https://www.ovhcloud.com/de/managed-bare-metal/',
      ES: 'https://www.ovhcloud.com/es-es/managed-bare-metal/',
      FI: 'https://www.ovhcloud.com/en-ie/managed-bare-metal/',
      FR: 'https://www.ovhcloud.com/fr/managed-bare-metal/',
      GB: 'https://www.ovhcloud.com/en-gb/managed-bare-metal/',
      IE: 'https://www.ovhcloud.com/en-ie/managed-bare-metal/',
      IT: 'https://www.ovhcloud.com/it/managed-bare-metal/',
      LT: 'https://www.ovhcloud.com/en-ie/managed-bare-metal/',
      MA: 'https://www.ovhcloud.com/fr-ma/managed-bare-metal/',
      NL: 'https://www.ovhcloud.com/nl/managed-bare-metal/',
      PL: 'https://www.ovhcloud.com/pl/managed-bare-metal/',
      PT: 'https://www.ovhcloud.com/pt/managed-bare-metal/',
      SN: 'https://www.ovhcloud.com/fr-sn/managed-bare-metal/',
      TN: 'https://www.ovhcloud.com/fr-tn/managed-bare-metal/',
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
    cloud_disk_array: {
      FR: 'https://www.ovh.com/fr/cloud/cloud-disk-array/',
    },
    veeam: {
      FR: 'https://www.ovh.com/fr/storage-solutions/veeam-cloud-connect/',
    },
    veeam_enterprise: {
      DE: 'https://www.ovh.de/storage-solutions/veeam-enterprise.xml',
      ES: 'https://www.ovh.es/storage-solutions/veeam-enterprise.xml',
      FR: 'https://www.ovh.com/fr/storage-solutions/veeam-enterprise.xml',
      GB: 'https://www.ovh.co.uk/storage-solutions/veeam-enterprise.xml',
      IT: 'https://www.ovh.it/storage-solutions/veeam-enterprise.xml',
      NL: 'https://www.ovh.nl/storage-solutions/veeam-enterprise.xml',
      PL: 'https://www.ovh.pl/storage-solutions/veeam-enterprise.xml',
      PT: 'https://www.ovh.pt/storage-solutions/veeam-enterprise.xml',
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
    dedicatedOrder: {
      CZ: 'https://www.ovh.cz/dedikovane_servery',
      DE: 'https://www.ovh.de/dedicated_server',
      ES: 'https://www.ovh.es/servidores_dedicados',
      FI: 'https://www.ovh-hosting.fi/dedikoidut_palvelimet',
      FR: 'https://www.ovh.com/fr/serveurs_dedies',
      GB: 'https://www.ovh.co.uk/dedicated_servers',
      IE: 'https://www.ovh.ie/dedicated_servers',
      IT: 'https://www.ovh.it/server_dedicati',
      LT: 'https://www.ovh.lt/dedikuoti_serveriai',
      NL: 'https://www.ovh.nl/dedicated_servers',
      PL: 'https://www.ovh.pl/serwery_dedykowane',
      PT: 'https://www.ovh.pt/servidores_dedicados',
    },
    express_review_base: {
      CZ: 'https://www.ovh.cz/order/express/#/express/review',
      DE: 'https://www.ovh.de/order/express/#/express/review',
      ES: 'https://www.ovh.es/order/express/#/express/review',
      FI: 'https://www.ovh-hosting.fi/order/express/#/express/review',
      FR: 'https://www.ovh.com/fr/order/express/#/express/review',
      GB: 'https://www.ovh.co.uk/order/express/#/express/review',
      IE: 'https://www.ovh.ie/order/express/#/express/review',
      IT: 'https://www.ovh.it/order/express/#/express/review',
      LT: 'https://www.ovh.lt/order/express/#/express/review',
      NL: 'https://www.ovh.nl/order/express/#/express/review',
      PL: 'https://www.ovh.pl/order/express/#/express/review',
      PT: 'https://www.ovh.pt/order/express/#/express/review',
      MA: 'https://www.ovh.ma/order/express/#/express/review',
      SN: 'https://www.ovh.sn/order/express/#/express/review',
      TN: 'https://www.ovh.com/tn/order/express/#/express/review',
    },
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
      NL: 'https://www.ovh.nl/vps/',
      PL: 'https://www.ovh.pl/vps/',
      PT: 'https://www.ovh.pt/vps/',
      MA: 'https://www.ovh.ma/vps/',
      SN: 'https://www.ovh.sn/vps/',
      TN: 'https://www.ovh.com/tn/vps/',
    },
    cloudProjectOrder: {
      FR: 'https://www.ovh.com/manager/cloud/#/iaas/pci/project/new',
    },
    publicCloudProjectOrder: {
      FR: 'https://www.ovh.com/manager/public-cloud/#/pci/projects/new',
    },
    publicCloudKubernetes: {
      FR:
        'https://www.ovh.com/manager/public-cloud/#/pci/projects/default/kubernetes/new',
    },
    orderDomain: {
      CZ: 'https://www.ovh.cz/cgi-bin/newOrder/order.cgi',
      DE: 'https://www.ovh.de/order/webcloud/',
      ES: 'https://www.ovh.es/order/webcloud/',
      FI: 'https://www.ovh-hosting.fi/cgi-bin/newOrder/order.cgi',
      FR: 'https://www.ovh.com/fr/order/webcloud/',
      GB: 'https://www.ovh.co.uk/order/webcloud',
      IE: 'https://www.ovh.ie/order/webcloud',
      IT: 'https://www.ovh.it/order/webcloud/',
      LT: 'https://www.ovh.lt/order/webcloud/',
      NL: 'https://www.ovh.nl/order/webcloud/',
      PL: 'https://www.ovh.pl/order/webcloud/',
      PT: 'https://www.ovh.pt/order/webcloud/',
    },
    orderHosting: {
      CA: 'https://www.ovh.com/ca/en/',
      CZ: 'https://www.ovh.cz/webhosting/',
      DE: 'https://www.ovh.de/hosting/',
      EN: 'https://www.ovh.co.uk/web-hosting/',
      ES: 'https://www.ovh.es/hosting/',
      FI: 'https://www.ovh-hosting.fi/webhotelli/',
      FR: 'https://www.ovh.com/fr/hebergement-web/',
      GB: 'https://www.ovh.co.uk/web-hosting/',
      IE: 'https://www.ovh.ie/web-hosting/',
      IT: 'https://www.ovh.it/hosting-web/',
      LT: 'https://www.ovh.lt/svetainiu-talpinimas/',
      MA: 'https://www.ovh.com/ma/hebergement-web/',
      NL: 'https://www.ovh.nl/shared-hosting/',
      PL: 'https://www.ovh.pl/hosting/',
      PT: 'https://www.ovh.pt/alojamento-partilhado/',
      QC: 'https://www.ovh.com/ca/fr/',
      RU: 'https://www.ovh.ie/web-hosting/',
      SN: 'https://www.ovh.sn/hebergement-web/',
      TN: 'https://www.ovh.com/tn/hebergement-web/',
      WE: 'http://www.ovh.com/us/',
    },
    orderCloudWeb: {
      CZ: 'https://www.ovh.cz/webhosting/cloud-web.xml',
      DE: 'https://www.ovh.de/hosting/cloud-web.xml',
      EN: 'https://www.ovh.co.uk/web-hosting/cloud-web.xml',
      ES: 'https://www.ovh.es/hosting/cloud-web.xml',
      FI: 'https://www.ovh-hosting.fi/webhotelli/cloud-web.xml',
      FR: 'https://www.ovh.com/fr/hebergement-web/cloud-web.xml',
      GB: 'https://www.ovh.co.uk/web-hosting/cloud-web.xml',
      IE: 'https://www.ovh.ie/web-hosting/cloud-web.xml',
      IT: 'https://www.ovh.it/hosting-web/cloud-web.xml',
      LT: 'https://www.ovh.lt/svetainiu-talpinimas/cloud-web.xml',
      MA: 'https://www.ovh.com/ma/hebergement-web/cloud-web.xml',
      NL: 'https://www.ovh.nl/shared-hosting/cloud-web.xml',
      PL: 'https://www.ovh.pl/hosting/cloud-web.xml',
      PT: 'https://www.ovh.pt/alojamento-partilhado/cloud-web.xml',
      SN: 'https://www.ovh.sn/hebergement-web/cloud-web.xml',
      TN: 'https://www.ovh.com/tn/hebergement-web/cloud-web.xml',
    },
    orderEmailPro: {
      CZ: 'https://www.ovh.cz/emails/email-pro/',
      DE: 'https://www.ovh.de/emails/email-pro/',
      ES: 'https://www.ovh.es/emails/email-pro/',
      FI: 'https://www.ovh-hosting.fi/sahkopostit/email-pro/',
      FR: 'https://www.ovh.com/fr/emails/email-pro/',
      GB: 'https://www.ovh.co.uk/emails/email-pro/',
      IT: 'https://www.ovh.it/emails/email-pro/',
      LT: 'https://www.ovh.lt/El_pastas/email-pro/',
      NL: 'https://www.ovh.nl/emails/email-pro/',
      PL: 'https://www.ovh.pl/emaile/email-pro/',
      PT: 'https://www.ovh.pt/emails/email-pro/',
    },
    orderOffice: {
      CZ: 'https://www.ovh.cz/office-365/',
      DE: 'https://www.ovh.de/office-365/',
      ES: 'https://www.ovh.es/office-365/',
      FI: 'https://www.ovh-hosting.fi/office-365/',
      FR: 'https://www.ovh.com/fr/office-365/',
      GB: 'https://www.ovh.co.uk/office-365/',
      IT: 'https://www.ovh.it/office-365/',
      LT: 'https://www.ovh.lt/office-365/',
      NL: 'https://www.ovh.nl/office-365/',
      PL: 'https://www.ovh.pl/office-365/',
      PT: 'https://www.ovh.pt/office-365/',
    },
    orderCsp2: {
      CZ: 'https://www.ovh.com/manager/sunrise/index.html#/csp2',
      DE: 'https://www.ovh.com/manager/sunrise/index.html#/csp2',
      ES: 'https://www.ovh.com/manager/sunrise/index.html#/csp2',
      FI: 'https://www.ovh.com/manager/sunrise/index.html#/csp2',
      FR: 'https://www.ovh.com/manager/sunrise/index.html#/csp2',
      GB: 'https://www.ovh.com/manager/sunrise/index.html#/csp2',
      IT: 'https://www.ovh.com/manager/sunrise/index.html#/csp2',
      LT: 'https://www.ovh.com/manager/sunrise/index.html#/csp2',
      NL: 'https://www.ovh.com/manager/sunrise/index.html#/csp2',
      PL: 'https://www.ovh.com/manager/sunrise/index.html#/csp2',
      PT: 'https://www.ovh.com/manager/sunrise/index.html#/csp2',
    },
    ovh_cloud_connect: {
      FR:
        'https://www.ovhcloud.com/fr/network-security/ovhcloud-connect/provider/',
      GB:
        'https://www.ovhcloud.com/en/network-security/ovhcloud-connect/provider/',
    },
    dbaas_logs: {
      EU: 'https://www.ovh.com/manager/dedicated/#/dbaas/logs/welcome',
    },
    faxOrder: {
      FR: 'https://www.ovhtelecom.fr/fax/',
    },
    smsHlr: {
      FR: 'https://www.ovhtelecom.fr/sms/home-location-register/',
    },
    office365_business: {
      ES: 'https://www.ovh.es/office-365/',
      FR: 'https://www.ovhtelecom.fr/office-365-business/',
    },
    office365_sharepoint: {
      ES: 'https://www.ovh.es/sharepoint/?range=mail',
      FR: 'https://www.ovhtelecom.fr/sharepoint/?range=mail',
    },
    email_exchange: {
      ES: 'https://www.ovh.es/emails/hosted-exchange/',
      FR: 'https://www.ovh.com/fr/emails/hosted-exchange/',
    },
    email_sharepoint: {
      ES: 'https://www.ovh.es/sharepoint/?range=mail',
      FR: 'https://www.ovhtelecom.fr/sharepoint/?range=mail',
    },
    telephony_voip: {
      FR: 'https://www.ovhtelecom.fr/telephonie/voip/',
    },
    telephony_siptrunk: {
      FR: 'https://www.ovhtelecom.fr/telephonie/sip-trunk/',
    },
    telephony_siptrunkCall: {
      FR: 'https://www.ovhtelecom.fr/telephonie/sip-trunk-forfait-inclus/',
    },
    internet_xdsl: {
      FR: 'https://www.ovhtelecom.fr/adsl/',
    },
    internet_fiber: {
      FR: 'https://www.ovhtelecom.fr/fibre/',
    },
    internet_sdsl: {
      FR: 'https://www.ovhtelecom.fr/sdsl/',
    },
    internet_adsl_creation: {
      FR: 'https://www.ovhtelecom.fr/adsl/ouvrir-une-ligne.xml',
    },
    internet_otb: {
      FR: 'https://www.ovhtelecom.fr/overthebox/tarifs.xml',
    },
    domain: {
      ES: 'https://www.ovh.es/dominios/',
      FR: 'https://www.ovh.com/fr/domaines/tarifs/',
    },
  },
  CA: {
    DEDICATED: {
      ASIA: 'https://ca.ovh.com/manager/dedicated/',
      AU: 'https://ca.ovh.com/manager/dedicated/',
      CA: 'https://ca.ovh.com/manager/dedicated/',
      QC: 'https://ca.ovh.com/manager/dedicated/',
      SG: 'https://ca.ovh.com/manager/dedicated/',
      WE: 'https://ca.ovh.com/manager/dedicated/',
      WS: 'https://ca.ovh.com/manager/dedicated/',
    },
    orderDomain: {
      ASIA: 'https://ca.ovh.com/asia/order/webcloud',
      AU: 'https://ca.ovh.com/au/order/webcloud',
      CA: 'https://ca.ovh.com/en/order/webcloud',
      QC: 'https://ca.ovh.com/fr/order/webcloud',
      SG: 'https://ca.ovh.com/sg/order/webcloud',
      WE: 'https://us.ovh.com/us/order/webcloud',
      WS: 'https://us.ovh.com/es/order/webcloud',
    },
    orderHosting: {
      ASIA: 'https://www.ovh.com/asia/web-hosting/',
      AU: 'https://www.ovh.com.au/web-hosting/',
      CA: 'https://www.ovh.com/ca/en/web-hosting/',
      QC: 'https://www.ovh.com/ca/fr/hebergement-web/',
      SG: 'https://www.ovh.com/sg/web-hosting/',
      WE: 'http://www.ovh.com/world/web-hosting/',
      WS: 'https://www.ovh.com/world/es/hosting/',
    },
    dedicated_cloud: {
      ASIA:
        'https://www.ovhcloud.com/en-sg/enterprise/products/hosted-private-cloud/prices/',
      AU:
        'https://www.ovhcloud.com/en-au/enterprise/products/hosted-private-cloud/prices/',
      CA:
        'https://www.ovhcloud.com/en-ca/enterprise/products/hosted-private-cloud/prices/',
      QC:
        'https://www.ovhcloud.com/fr-ca/enterprise/products/hosted-private-cloud/prices/',
      SG:
        'https://www.ovhcloud.com/en-sg/enterprise/products/hosted-private-cloud/prices/',
      WE:
        'https://www.ovhcloud.com/en/enterprise/products/hosted-private-cloud/prices/',
      WS:
        'https://www.ovhcloud.com/es/enterprise/products/hosted-private-cloud/prices/',
    },
    managed_bare_metal: {
      ASIA: 'https://www.ovhcloud.com/asia/managed-bare-metal/',
      AU: 'https://www.ovhcloud.com/en-au/managed-bare-metal/',
      CA: 'https://www.ovhcloud.com/en-ca/managed-bare-metal/',
      QC: 'https://www.ovhcloud.com/fr-ca/managed-bare-metal/',
      SG: 'https://www.ovhcloud.com/en-sg/managed-bare-metal/',
      WE: 'https://www.ovhcloud.com/en/managed-bare-metal/',
      WS: 'https://www.ovhcloud.com/es/managed-bare-metal/',
    },
    cloud_disk_array: {},
    dbaas_logs: {
      CA: 'https://ca.ovh.com/manager/dedicated/#/dbaas/logs/welcome',
    },
    veeam: {},
    veeam_enterprise: {
      CA: 'https://www.ovh.com/ca/en/storage-solutions/veeam-enterprise.xml',
      QC: 'https://www.ovh.com/ca/fr/storage-solutions/veeam-enterprise.xml',
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
    load_balancer: {
      ASIA: 'https://www.ovh.com/asia/solutions/ip-load-balancing/',
      AU: 'https://www.ovh.com.au/solutions/ip-load-balancing/',
      CA: 'https://www.ovh.com/ca/en/solutions/ip-load-balancing/',
      QC: 'https://www.ovh.com/ca/fr/solutions/ip-load-balancing/',
      SG: 'https://www.ovh.com/sg/solutions/ip-load-balancing/',
      WE: 'https://www.ovh.com/us/solutions/ip-load-balancing/',
      WS: 'https://www.ovh.com/us/es/soluciones/ip-load-balancing/',
    },
    dedicatedOrder: {
      ASIA: 'https://www.ovh.com/asia/dedicated-servers',
      AU: 'https://www.ovh.com.au/dedicated-servers',
      CA: 'https://www.ovh.com/ca/en/dedicated-servers',
      QC: 'https://www.ovh.com/ca/fr/serveurs-dedies',
      SG: 'https://www.ovh.com/sg/dedicated-servers',
      WE: 'https://www.ovh.com/world/dedicated-servers',
      WS: 'https://www.ovh.com/world/dedicated-servers',
    },
    cloudProjectOrder: {
      ASIA: 'https://ca.ovh.com/manager/cloud/index.html#/iaas/pci/project/new',
      AU: 'https://ca.ovh.com/manager/cloud/index.html#/iaas/pci/project/new',
      CA: 'https://ca.ovh.com/manager/cloud/index.html#/iaas/pci/project/new',
      QC: 'https://ca.ovh.com/manager/cloud/index.html#/iaas/pci/project/new',
      SG: 'https://ca.ovh.com/manager/cloud/index.html#/iaas/pci/project/new',
      WE: 'https://ca.ovh.com/manager/cloud/index.html#/iaas/pci/project/new',
      WS: 'https://ca.ovh.com/manager/cloud/index.html#/iaas/pci/project/new',
    },
    publicCloudProjectOrder: {
      ASIA: 'https://ca.ovh.com/manager/public-cloud/#/pci/projects/new',
      AU: 'https://ca.ovh.com/manager/public-cloud/#/pci/projects/new',
      CA: 'https://ca.ovh.com/manager/public-cloud/#/pci/projects/new',
      QC: 'https://ca.ovh.com/manager/public-cloud/#/pci/projects/new',
      SG: 'https://ca.ovh.com/manager/public-cloud/#/pci/projects/new',
      WE: 'https://ca.ovh.com/manager/public-cloud/#/pci/projects/new',
      WS: 'https://ca.ovh.com/manager/public-cloud/#/pci/projects/new',
    },
    publicCloudKubernetes: {},
    express_review_base: {
      ASIA: 'https://ca.ovh.com/asia/order/express/#/express/review',
      AU: 'https://ca.ovh.com/au/order/express/#/express/review',
      CA: 'https://ca.ovh.com/en/order/express/#/express/review',
      QC: 'https://ca.ovh.com/fr/order/express/#/express/review',
      SG: 'https://ca.ovh.com/sg/order/express/#/express/review',
      WE: 'https://us.ovh.com/us/order/express/#/express/review',
      WS: 'https://us.ovh.com/es/order/express/#/express/review',
    },
    vps: {
      ASIA: 'https://www.ovh.com/asia/vps/',
      AU: 'https://www.ovh.com.au/vps/',
      CA: 'https://www.ovh.com/ca/en/vps/',
      QC: 'https://www.ovh.com/ca/fr/vps/',
      SG: 'https://www.ovh.com/sg/vps/',
      WE: 'https://www.ovh.com/us/vps/',
      WS: 'https://www.ovh.com/us/es/vps/',
    },
  },
  US: {
    DEDICATED: {
      US: 'https://us.ovhcloud.com/bare-metal/',
    },
    dedicated_cloud: {
      US: 'https://us.ovhcloud.com/enterprise/products/hosted-private-cloud',
    },
    managed_bare_metal: {
      US: 'https://us.ovhcloud.com/managed-bare-metal/',
    },
    cloud_disk_array: {
      US: 'https://us.ovhcloud.com/cloud/cloud-disk-array/',
    },
    veeam: {},
    veeam_enterprise: {
      US:
        'https://us.ovhcloud.com/enterprise/products/hosted-private-cloud/veeam-enterprise/',
    },
    vrack: {
      US:
        "https://us.ovhcloud.com/order/express/#/express/review?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
    },
    load_balancer: {
      US: 'https://us.ovhcloud.com/solutions/ip-load-balancing/',
    },
    dedicatedOrder: {
      US: 'https://us.ovhcloud.com/bare-metal/prices/',
    },
    cloudProjectOrder: {
      US: 'https://us.ovhcloud.com/manager/cloud/#/iaas/pci/offer',
    },
    publicCloudProjectOrder: {
      US: 'https://us.ovhcloud.com/manager/public-cloud/#/pci/projects/new',
    },
    publicCloudKubernetes: {},
    express_review_base: {
      US: 'https://us.ovhcloud.com/order/express/#/express/review',
    },
    vps: {
      US: 'https://us.ovhcloud.com/vps',
    },
  },
};

export const SIDEBAR_ORDER_CONFIG = [
  {
    id: 'order-pci-project-new',
    title: 'cloud_project',
    feature: 'public-cloud',
    icon: 'ovh-font ovh-font-public-cloud',
    linkId: 'publicCloudProjectOrder',
    app: [DEDICATED],
    tracker: 'dedicated::orders::public-cloud-project::order',
  },
  {
    id: 'order-dedicated-server',
    title: 'dedicated_server',
    feature: 'dedicated-server:order',
    icon: 'ovh-font ovh-font-server',
    linkId: 'dedicatedOrder',
    target: '_blank',
    external: true,
    app: [DEDICATED],
    tracker: 'dedicated::orders::dedicated-servers::order',
  },
  {
    id: 'order-additional-ip',
    title: 'ip',
    feature: 'ip',
    icon: 'ovh-font ovh-font-ip',
    state: 'app.ip.dashboard.agora-order',
    linkId: 'DEDICATED',
    linkPart: '#/configuration/ip?landingTo=ip&tab=ip',
    app: [DEDICATED],
    tracker: 'dedicated::orders::additional-ip::order',
  },
  {
    id: 'order-license',
    title: 'licence',
    feature: 'license',
    icon: 'ovh-font ovh-font-certificate',
    linkId: 'DEDICATED',
    linkPart: '#/configuration/license/order',
    state: 'app.license.order',
    app: [DEDICATED],
    tracker: 'dedicated::orders::licences::order',
  },

  {
    id: 'order-kube',
    title: 'kube',
    feature: 'kubernetes',
    icon: 'ovh-font ovh-font-kubernetes',
    linkId: 'publicCloudKubernetes',
    target: '_blank',
    external: true,
    app: [DEDICATED],
    tracker: 'dedicated::orders::managed-kubernetes::order',
  },
  {
    id: 'order-vps',
    title: 'vps',
    feature: 'vps',
    icon: 'ovh-font ovh-font-server2',
    linkId: 'vps',
    target: '_blank',
    external: true,
    app: [DEDICATED],
    tracker: 'dedicated::orders::vps::order',
  },
  {
    id: 'order-managed-bare-metal',
    title: 'managed_bare_metal',
    feature: 'managed-bare-metal',
    icon: 'oui-icon oui-icon-cloud-essential_concept',
    linkId: 'managed_bare_metal',
    target: '_blank',
    external: true,
    app: [DEDICATED],
    tracker: 'dedicated::orders::mbm::order',
  },
  {
    id: 'order-private-cloud',
    title: 'dedicated_cloud',
    feature: 'dedicated-cloud:order',
    icon: 'ovh-font ovh-font-dedicatedCloud',
    linkId: 'dedicated_cloud',
    target: '_blank',
    external: true,
    app: [DEDICATED],
    tracker: 'dedicated::orders::hpc::order',
  },
  {
    id: 'order-cda',
    title: 'paas_cda',
    feature: 'cloud-disk-array',
    icon: 'ovh-font ovh-font-cloud-disk-array',
    linkId: 'cloud_disk_array',
    target: '_blank',
    external: true,
    app: [DEDICATED],
    tracker: 'dedicated::orders::cloud-disk-array::order',
  },
  {
    id: 'order-nasha',
    title: 'NASHA',
    feature: 'dedicated-nasha',
    icon: 'ovh-font ovh-font-cloudnas',
    linkId: 'DEDICATED',
    linkPart: '#/nasha/new',
    app: [DEDICATED],
    tracker: 'dedicated::orders::nasha::order',
  },
  {
    id: 'order-veeam',
    title: 'paas_veeam',
    feature: 'veeam-cloud-connect:order',
    icon: 'ovh-font ovh-font-veeam',
    linkId: 'veeam',
    target: '_blank',
    external: true,
    app: [DEDICATED],
    tracker: 'dedicated::orders::veeam-cc::order',
  },
  {
    id: 'order-veeam-enterprise',
    title: 'paas_veeam_enterprise',
    feature: 'veeam-enterprise:order',
    icon: 'ovh-font ovh-font-veeam',
    linkId: 'veeam_enterprise',
    target: '_blank',
    external: true,
    app: [DEDICATED],
    tracker: 'dedicated::orders::veeam-enterprise::order',
  },
  {
    id: 'order-vrack',
    title: 'vrack',
    feature: 'vrack:order',
    icon: 'ovh-font ovh-font-vRack',
    linkId: 'vrack',
    target: '_blank',
    external: true,
    app: [DEDICATED],
    tracker: 'dedicated::orders::vrack::order',
  },
  {
    id: 'order-loadbalancer',
    title: 'iplb',
    feature: 'ip-load-balancer',
    icon: 'ovh-font ovh-font-ip',
    linkId: 'load_balancer',
    target: '_blank',
    external: true,
    app: [DEDICATED],
    tracker: 'dedicated::orders::ip-load-balancer::order',
  },
  {
    id: 'order-logs',
    title: 'logs',
    feature: 'logs-data-platform',
    icon: 'fa fa-bar-chart',
    linkId: 'DEDICATED',
    linkPart: '#/dbaas/logs/order',
    app: [DEDICATED],
    tracker: 'dedicated::orders::logs::order',
  },
  {
    id: 'order-ovh-cloud-connect',
    feature: 'cloud-connect',
    title: 'ovh_cloud_connect',
    icon: 'oui-icon oui-icon-line-communicating_concept',
    linkId: 'ovh_cloud_connect',
    target: '_blank',
    external: true,
    app: [DEDICATED],
    tracker: 'dedicated::orders::ovh-cloud-connect::order',
  },
];

export default { ORDER_URLS, SIDEBAR_ORDER_CONFIG };
