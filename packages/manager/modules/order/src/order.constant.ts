import JSURL from 'jsurl';

export const getVeeamBackupProductSettings = ({
  orgId,
  datacenterZone = 'eu-central-waw-a',
}: {
  orgId: string;
  datacenterZone?: string;
}) =>
  JSURL.stringify({
    planCode: 'backup-veeam-vcd',
    quantity: 1,
    productId: 'vmwareCloudDirectorBackup',
    duration: 'P1M',
    pricingMode: 'default',
    configuration: [
      { label: 'datacenter-zone', value: datacenterZone },
      { label: 'org-id', value: orgId },
    ],
  });

export const vrackProductSettings = JSURL.stringify({
  planCode: 'vrack',
  quantity: 1,
  productId: 'vrack',
});

export const getVrackServicesProductSettings = ({
  displayName,
  region,
}: {
  displayName?: string;
  region: string;
}) =>
  JSURL.stringify({
    productId: 'vrackServices',
    planCode: 'vrack-services',
    duration: 'P1M',
    pricingMode: 'default',
    configuration: [
      displayName && { label: 'displayName', value: displayName },
      { label: 'region', value: region },
    ].filter(Boolean),
  });

export const getKMSProductSettings = ({ region }: { region: string }) =>
  JSURL.stringify({
    productId: 'okms',
    planCode: 'okms',
    duration: 'P1M',
    pricingMode: 'default',
    configuration: [{ label: 'region', value: region }].filter(Boolean),
  });

export const getVcdProductSettings = ({
  serviceName,
  planCode,
  quantity = 1,
  vdcOrgId,
}: {
  serviceName: string;
  planCode: string;
  quantity?: number;
  vdcOrgId?: string;
}) =>
  JSURL.stringify({
    serviceName,
    planCode,
    quantity,
    productId: 'vmwareCloudDirector',
    duration: 'P1M',
    pricingMode: 'default',
    configuration: vdcOrgId
      ? [{ label: 'vdc-org-id', value: vdcOrgId }]
      : undefined,
  });

export const ORDER_URLS = {
  EU: {
    DEDICATED: {
      FR: 'https://www.ovh.com/manager/dedicated/',
    },
    dedicated_cloud: {
      DE: 'https://www.ovhcloud.com/de/hosted-private-cloud/vmware/prices/',
      ES: 'https://www.ovhcloud.com/es-es/hosted-private-cloud/vmware/prices/',
      FR: 'https://www.ovhcloud.com/fr/hosted-private-cloud/vmware/prices/',
      GB: 'https://www.ovhcloud.com/en-gb/hosted-private-cloud/vmware/prices/',
      IE: 'https://www.ovhcloud.com/en-ie/hosted-private-cloud/vmware/prices/',
      IT: 'https://www.ovhcloud.com/it/hosted-private-cloud/vmware/prices/',
      MA: 'https://www.ovhcloud.com/fr-ma/hosted-private-cloud/vmware/prices/',
      NL: 'https://www.ovhcloud.com/nl/hosted-private-cloud/vmware/prices/',
      PL: 'https://www.ovhcloud.com/pl/hosted-private-cloud/vmware/prices/',
      PT: 'https://www.ovhcloud.com/pt/hosted-private-cloud/vmware/prices/',
      SN: 'https://www.ovhcloud.com/fr-sn/hosted-private-cloud/vmware/prices/',
      TN: 'https://www.ovhcloud.com/fr-tn/hosted-private-cloud/vmware/prices/',
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
    sap_hana: {
      FR: 'https://www.ovhcloud.com/fr/hosted-private-cloud/sap-hana/',
      TN: 'https://www.ovhcloud.com/fr-tn/hosted-private-cloud/sap-hana/',
      IT: 'https://www.ovhcloud.com/it/hosted-private-cloud/sap-hana/',
      PL: 'https://www.ovhcloud.com/pl/hosted-private-cloud/sap-hana/',
      NL: 'https://www.ovhcloud.com/nl/hosted-private-cloud/sap-hana/',
      PT: 'https://www.ovhcloud.com/pt/hosted-private-cloud/sap-hana/',
      SN: 'https://www.ovhcloud.com/fr-sn/hosted-private-cloud/sap-hana/',
      MA: 'https://www.ovhcloud.com/fr-ma/hosted-private-cloud/sap-hana/',
      ES: 'https://www.ovhcloud.com/es-es/hosted-private-cloud/sap-hana/',
      IE: 'https://www.ovhcloud.com/en-ie/hosted-private-cloud/sap-hana/',
      GB: 'https://www.ovhcloud.com/en-gb/hosted-private-cloud/sap-hana/',
      DE: 'https://www.ovhcloud.com/de/hosted-private-cloud/sap-hana/',
    },
    vrack: {
      CZ: `https://www.ovh.cz/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      DE: `https://www.ovh.de/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      ES: `https://www.ovh.es/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      FI: `https://www.ovh-hosting.fi/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      FR: `https://www.ovh.com/fr/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      GB: `https://www.ovh.co.uk/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      IE: `https://www.ovh.ie/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      IT: `https://www.ovh.it/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      LT: `https://www.ovh.lt/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      MA: `https://www.ovh.ma/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      NL: `https://www.ovh.nl/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      PL: `https://www.ovh.pl/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      PT: `https://www.ovh.pt/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      SN: `https://www.ovh.sn/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      TN: `https://www.ovh.com/tn/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
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
      CZ: 'https://www.ovhcloud.com/en-ie/bare-metal/prices/',
      DE: 'https://www.ovhcloud.com/de/bare-metal/prices/',
      ES: 'https://www.ovhcloud.com/es-es/bare-metal/prices/',
      FI: 'https://www.ovhcloud.com/en-ie/bare-metal/prices/',
      FR: 'https://www.ovhcloud.com/fr/bare-metal/prices/',
      GB: 'https://www.ovhcloud.com/en-gb/bare-metal/prices/',
      IE: 'https://www.ovhcloud.com/en-ie/bare-metal/prices/',
      IT: 'https://www.ovhcloud.com/it/bare-metal/prices/',
      LT: 'https://www.ovhcloud.com/en-ie/bare-metal/prices/',
      NL: 'https://www.ovhcloud.com/nl/bare-metal/prices/',
      PL: 'https://www.ovhcloud.com/pl/bare-metal/prices/',
      PT: 'https://www.ovhcloud.com/pt/bare-metal/prices/',
    },
    dedicatedEcoRangeOrder: {
      CZ: 'https://eco.ovhcloud.com/en-ie/',
      DE: 'https://eco.ovhcloud.com/de/',
      ES: 'https://eco.ovhcloud.com/es-es/',
      FI: 'https://eco.ovhcloud.com/en-ie/',
      FR: 'https://eco.ovhcloud.com/fr/',
      GB: 'https://eco.ovhcloud.com/en-gb/',
      IE: 'https://eco.ovhcloud.com/en-ie/',
      IT: 'https://eco.ovhcloud.com/it/',
      LT: 'https://eco.ovhcloud.com/en-ie/',
      NL: 'https://eco.ovhcloud.com/nl/',
      PL: 'https://eco.ovhcloud.com/pl/',
      PT: 'https://eco.ovhcloud.com/pt/',
      MA: 'https://eco.ovhcloud.com/fr-ma/',
      SN: 'https://eco.ovhcloud.com/fr-sn/',
      TN: 'https://eco.ovhcloud.com/fr-tn/',
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    publicCloudKubernetes: null,
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
      WE: 'https://www.ovh.com/us/',
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
      FR: 'https://www.ovhcloud.com/fr/network-security/ovhcloud-connect/',
      GB: 'https://www.ovhcloud.com/en/network-security/ovhcloud-connect/',
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
    telephony_accessory_order: {
      FR: 'https://www.ovhtelecom.fr/manager/#/telecom/orders/accessories',
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
    dedicatedNutanixOrder: {
      CZ: 'https://www.ovhcloud.com/en-ie/hosted-private-cloud/nutanix/',
      DE: 'https://www.ovhcloud.com/de/hosted-private-cloud/nutanix/',
      ES: 'https://www.ovhcloud.com/es-es/hosted-private-cloud/nutanix/',
      FI: 'https://www.ovhcloud.com/en-ie/hosted-private-cloud/nutanix/',
      FR: 'https://www.ovhcloud.com/fr/hosted-private-cloud/nutanix/',
      GB: 'https://www.ovhcloud.com/en-gb/hosted-private-cloud/nutanix/',
      IE: 'https://www.ovhcloud.com/en-ie/hosted-private-cloud/nutanix/',
      IT: 'https://www.ovhcloud.com/it/hosted-private-cloud/nutanix/',
      LT: 'https://www.ovhcloud.com/en-ie/hosted-private-cloud/nutanix/',
      NL: 'https://www.ovhcloud.com/nl/hosted-private-cloud/nutanix/',
      PL: 'https://www.ovhcloud.com/pl/hosted-private-cloud/nutanix/',
      PT: 'https://www.ovhcloud.com/pt/hosted-private-cloud/nutanix/',
      MA: 'https://www.ovhcloud.com/fr-ma/hosted-private-cloud/nutanix/',
      SN: 'https://www.ovhcloud.com/fr-sn/hosted-private-cloud/nutanix/',
      TN: 'https://www.ovhcloud.com/fr-tn/hosted-private-cloud/nutanix/',
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
      IN: 'https://ca.ovh.com/manager/dedicated/',
    },
    orderDomain: {
      ASIA: 'https://ca.ovh.com/asia/order/webcloud',
      IN: 'https://ca.ovh.com/in/order/webcloud',
      AU: 'https://ca.ovh.com/au/order/webcloud',
      CA: 'https://ca.ovh.com/en/order/webcloud',
      QC: 'https://ca.ovh.com/fr/order/webcloud',
      SG: 'https://ca.ovh.com/sg/order/webcloud',
      WE: 'https://us.ovh.com/us/order/webcloud',
      WS: 'https://us.ovh.com/es/order/webcloud',
    },
    orderHosting: {
      ASIA: 'https://www.ovh.com/asia/web-hosting/',
      IN: 'https://www.ovhcloud.com/en-in/web-hosting/',
      AU: 'https://www.ovh.com.au/web-hosting/',
      CA: 'https://www.ovh.com/ca/en/web-hosting/',
      QC: 'https://www.ovh.com/ca/fr/hebergement-web/',
      SG: 'https://www.ovh.com/sg/web-hosting/',
      WE: 'https://www.ovh.com/world/web-hosting/',
      WS: 'https://www.ovh.com/world/es/hosting/',
    },
    dedicated_cloud: {
      ASIA: 'https://www.ovhcloud.com/asia/hosted-private-cloud/vmware/prices/',
      IN: 'https://www.ovhcloud.com/en-in/hosted-private-cloud/vmware/prices/',
      AU: 'https://www.ovhcloud.com/en-au/hosted-private-cloud/vmware/prices/',
      CA: 'https://www.ovhcloud.com/en-ca/hosted-private-cloud/vmware/prices/',
      QC: 'https://www.ovhcloud.com/fr-ca/hosted-private-cloud/vmware/prices/',
      SG: 'https://www.ovhcloud.com/en-sg/hosted-private-cloud/vmware/prices/',
      WE: 'https://www.ovhcloud.com/en/hosted-private-cloud/vmware/prices/',
      WS: 'https://www.ovhcloud.com/es/hosted-private-cloud/vmware/prices/',
    },
    managed_bare_metal: {
      ASIA: 'https://www.ovhcloud.com/asia/managed-bare-metal/',
      IN: 'https://www.ovhcloud.com/en-in/managed-bare-metal/',
      AU: 'https://www.ovhcloud.com/en-au/managed-bare-metal/',
      CA: 'https://www.ovhcloud.com/en-ca/managed-bare-metal/',
      QC: 'https://www.ovhcloud.com/fr-ca/managed-bare-metal/',
      SG: 'https://www.ovhcloud.com/en-sg/managed-bare-metal/',
      WE: 'https://www.ovhcloud.com/en/managed-bare-metal/',
      WS: 'https://www.ovhcloud.com/es/managed-bare-metal/',
    },
    sap_hana: {
      QC: 'https://www.ovhcloud.com/fr-ca/hosted-private-cloud/sap-hana/',
      WS: 'https://www.ovhcloud.com/es/hosted-private-cloud/sap-hana/',
      WE: 'https://www.ovhcloud.com/en/hosted-private-cloud/sap-hana/',
      SG: 'https://www.ovhcloud.com/en-sg/hosted-private-cloud/sap-hana/',
      CA: 'https://www.ovhcloud.com/en-ca/hosted-private-cloud/sap-hana/',
      AU: 'https://www.ovhcloud.com/en-au/hosted-private-cloud/sap-hana/',
      ASIA: 'https://www.ovhcloud.com/asia/hosted-private-cloud/sap-hana/',
      IN: 'https://www.ovhcloud.com/en-in/hosted-private-cloud/sap-hana/',
    },
    cloud_disk_array: {},
    dbaas_logs: {
      CA: 'https://ca.ovh.com/manager/dedicated/#/dbaas/logs/welcome',
    },
    veeam: {},
    veeam_enterprise: {
      CA: 'https://www.ovh.com/ca/en/storage-solutions/veeam-enterprise.xml',
      QC: 'https://www.ovh.com/ca/fr/storage-solutions/veeam-enterprise.xml',
      IN: 'https://www.ovhcloud.com/en-in/storage-solutions/veeam-enterprise',
    },
    vrack: {
      ASIA: `https://ca.ovh.com/asia/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      IN: `https://ca.ovh.com/in/order/express/#/express/review?products=~(${vrackProductSettings})`,
      AU: `https://ca.ovh.com/au/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      CA: `https://ca.ovh.com/en/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      QC: `https://ca.ovh.com/fr/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      SG: `https://ca.ovh.com/sg/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      WE: `https://us.ovh.com/us/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      WS: `https://us.ovh.com/es/order/express/#/new/express/resume?products=~(${vrackProductSettings})`,
    },
    load_balancer: {
      ASIA: 'https://www.ovh.com/asia/solutions/ip-load-balancing/',
      IN: 'https://www.ovhcloud.com/en-in/network/load-balancer/',
      AU: 'https://www.ovh.com.au/solutions/ip-load-balancing/',
      CA: 'https://www.ovh.com/ca/en/solutions/ip-load-balancing/',
      QC: 'https://www.ovh.com/ca/fr/solutions/ip-load-balancing/',
      SG: 'https://www.ovh.com/sg/solutions/ip-load-balancing/',
      WE: 'https://www.ovh.com/us/solutions/ip-load-balancing/',
      WS: 'https://www.ovh.com/us/es/soluciones/ip-load-balancing/',
    },
    dedicatedOrder: {
      ASIA: 'https://www.ovhcloud.com/asia/bare-metal/prices/',
      IN: 'https://www.ovhcloud.com/en-in/bare-metal/prices/',
      AU: 'https://www.ovhcloud.com/en-au/bare-metal/prices/',
      CA: 'https://www.ovhcloud.com/en-ca/bare-metal/prices/',
      QC: 'https://www.ovhcloud.com/fr-ca/bare-metal/prices/',
      SG: 'https://www.ovhcloud.com/en-sg/bare-metal/prices/',
      WE: 'https://www.ovhcloud.com/en/bare-metal/prices/',
      WS: 'https://www.ovhcloud.com/en/bare-metal/prices/',
    },
    dedicatedEcoRangeOrder: {
      ASIA: 'https://eco.ovhcloud.com/asia/',
      IN: 'https://eco.ovhcloud.com/en-in/',
      AU: 'https://eco.ovhcloud.com/en-au/',
      CA: 'https://eco.ovhcloud.com/en-ca/',
      QC: 'https://eco.ovhcloud.com/fr-ca/',
      SG: 'https://eco.ovhcloud.com/en-sg/',
      WE: 'https://eco.ovhcloud.com/en/',
      WS: 'https://eco.ovhcloud.com/en/',
    },
    cloudProjectOrder: {
      ASIA: 'https://ca.ovh.com/manager/cloud/index.html#/iaas/pci/project/new',
      IN: 'https://ca.ovh.com/manager/cloud/index.html#/iaas/pci/project/new',
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
      IN: 'https://ca.ovh.com/manager/public-cloud/#/pci/projects/new',
    },
    publicCloudKubernetes: {
      CA:
        'https://ca.ovh.com/manager/#/public-cloud/pci/projects/default/kubernetes/new',
    },
    express_review_base: {
      ASIA: 'https://ca.ovh.com/asia/order/express/#/express/review',
      IN: 'https://ca.ovh.com/in/order/express/#/express/review',
      AU: 'https://ca.ovh.com/au/order/express/#/express/review',
      CA: 'https://ca.ovh.com/en/order/express/#/express/review',
      QC: 'https://ca.ovh.com/fr/order/express/#/express/review',
      SG: 'https://ca.ovh.com/sg/order/express/#/express/review',
      WE: 'https://us.ovh.com/us/order/express/#/express/review',
      WS: 'https://us.ovh.com/es/order/express/#/express/review',
    },
    vps: {
      ASIA: 'https://www.ovh.com/asia/vps/',
      IN: 'https://www.ovhcloud.com/en-in/vps/',
      AU: 'https://www.ovh.com.au/vps/',
      CA: 'https://www.ovh.com/ca/en/vps/',
      QC: 'https://www.ovh.com/ca/fr/vps/',
      SG: 'https://www.ovh.com/sg/vps/',
      WE: 'https://www.ovh.com/us/vps/',
      WS: 'https://www.ovh.com/us/es/vps/',
    },
    dedicatedNutanixOrder: {
      ASIA: 'https://www.ovhcloud.com/asia/hosted-private-cloud/nutanix/',
      IN: 'https://www.ovhcloud.com/en-in/hosted-private-cloud/nutanix/',
      AU: 'https://www.ovhcloud.com/en-au/hosted-private-cloud/nutanix/',
      CA: 'https://www.ovhcloud.com/en-ca/hosted-private-cloud/nutanix/',
      QC: 'https://www.ovhcloud.com/fr-ca/hosted-private-cloud/nutanix/',
      SG: 'https://www.ovhcloud.com/en-sg/hosted-private-cloud/nutanix/',
      WE: 'https://www.ovhcloud.com/en/hosted-private-cloud/nutanix/',
      WS: 'https://www.ovhcloud.com/en/hosted-private-cloud/nutanix/',
    },
    ovh_cloud_connect: {
      CA: 'https://www.ovhcloud.com/en-ca/network/ovhcloud-connect/',
      QC: 'https://www.ovhcloud.com/fr-ca/network/ovhcloud-connect/',
      IN: 'https://www.ovhcloud.com/en-in/network/ovhcloud-connect/',
    },
  },
  US: {
    DEDICATED: {
      US: 'https://us.ovhcloud.com/bare-metal/',
    },
    dedicated_cloud: {
      US: 'https://us.ovhcloud.com/hosted-private-cloud/vmware/',
    },
    managed_bare_metal: {
      US: 'https://us.ovhcloud.com/managed-bare-metal/',
    },
    sap_hana: {
      US: 'https://us.ovhcloud.com/hosted-private-cloud/sap-hana/',
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
      US: `https://us.ovhcloud.com/order/express/#/express/review?products=~(~${vrackProductSettings})`,
    },
    load_balancer: {
      US: 'https://us.ovhcloud.com/network/load-balancer/',
    },
    dedicatedOrder: {
      US: 'https://us.ovhcloud.com/bare-metal/prices/',
    },
    dedicatedEcoRangeOrder: {
      US: 'https://eco.us.ovhcloud.com/',
    },
    cloudProjectOrder: {
      US: 'https://us.ovhcloud.com/manager/cloud/#/iaas/pci/offer',
    },
    publicCloudProjectOrder: {
      US: 'https://us.ovhcloud.com/manager/public-cloud/#/pci/projects/new',
    },
    publicCloudKubernetes: {
      US:
        'https://us.ovhcloud.com/manager/#/public-cloud/pci/projects/default/kubernetes/new',
    },
    express_review_base: {
      US: 'https://us.ovhcloud.com/order/express/#/express/review',
    },
    vps: {
      US: 'https://us.ovhcloud.com/vps',
    },
    ovh_cloud_connect: {
      US: 'https://us.ovhcloud.com/network/ovhcloud-connect/',
    },
  },
};

export const EXPRESS_ORDER_URLS = {
  EU: {
    DE: 'https://www.ovh.de/order/express/#/express/review',
    EN: 'https://www.ovh.co.uk/order/express/#/express/review',
    ES: 'https://www.ovh.es/order/express/#/express/review',
    FR: 'https://www.ovh.com/fr/order/express/#/express/review',
    GB: 'https://www.ovh.co.uk/order/express/#/express/review',
    IE: 'https://www.ovh.ie/order/express/#/express/review',
    IT: 'https://www.ovh.it/order/express/#/express/review',
    MA: 'https://www.ovh.com/ma/order/express/#/express/review',
    NL: 'https://www.ovh.nl/order/express/#/express/review',
    PL: 'https://www.ovh.pl/order/express/#/express/review',
    PT: 'https://www.ovh.pt/order/express/#/express/review',
    SN: 'https://www.ovh.sn/order/express/#/express/review',
    TN: 'https://www.ovh.com/tn/order/express/#/express/review',
    DEFAULT: 'https://www.ovh.ie/order/express/#/express/review',
  },
  CA: {
    ASIA: 'https://ca.ovh.com/asia/order/express/#/express/review',
    IN: 'https://ca.ovh.com/in/order/express/#/express/review',
    AU: 'https://ca.ovh.com/au/order/express/#/express/review',
    CA: 'https://ca.ovh.com/en/order/express/#/express/review',
    QC: 'https://ca.ovh.com/fr/order/express/#/express/review',
    SG: 'https://ca.ovh.com/sg/order/express/#/express/review',
    WE: 'https://us.ovh.com/us/order/express/#/express/review',
    WS: 'https://us.ovh.com/es/order/express/#/express/review',
    DEFAULT: 'https://us.ovh.com/us/order/express/#/express/review',
  },
  US: {
    DEFAULT: 'https://us.ovhcloud.com/order/express/#/express/review',
  },
};

export function getOrderURL(
  product: string,
  region: string,
  subsidiary: string,
) {
  const urls = (ORDER_URLS as any)[region]?.[product];
  if (urls) {
    const fallback = {
      EU: 'FR',
      CA: 'CA',
      US: 'US',
    }[region];
    return urls[subsidiary] || urls[fallback as string];
  }
  return '';
}

export function getExpressOrderURL(region: string, subsidiary: string): string {
  const regionURLs =
    EXPRESS_ORDER_URLS[region as keyof typeof EXPRESS_ORDER_URLS];
  return (
    regionURLs?.[subsidiary as keyof typeof regionURLs] || regionURLs?.DEFAULT
  );
}
