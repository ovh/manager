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
    configuration: vdcOrgId ? [{ label: 'vdc-org-id', value: vdcOrgId }] : undefined,
  });

export const getHYCUProductSettings = ({
  planCode,
  region,
  serviceName = '',
}: {
  planCode: string;
  region: string;
  serviceName?: string;
}) =>
  JSURL.stringify({
    productId: 'licenseHycu',
    serviceName,
    planCode,
    duration: 'P1M',
    pricingMode: 'default',
    configuration: [{ label: 'region', value: region }],
  });

export const ORDER_URLS: Record<'EU' | 'CA' | 'US', Record<string, Record<string, string>>> = {
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
      DE: 'https://www.ovhcloud.com/de/managed-bare-metal/',
      ES: 'https://www.ovhcloud.com/es-es/managed-bare-metal/',
      FR: 'https://www.ovhcloud.com/fr/managed-bare-metal/',
      GB: 'https://www.ovhcloud.com/en-gb/managed-bare-metal/',
      IE: 'https://www.ovhcloud.com/en-ie/managed-bare-metal/',
      IT: 'https://www.ovhcloud.com/it/managed-bare-metal/',
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
      DE: `https://order.eu.ovhcloud.com/de/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      ES: `https://order.eu.ovhcloud.com/es/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      FR: `https://order.eu.ovhcloud.com/fr/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      GB: `https://order.eu.ovhcloud.com/en-gb/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      IE: `https://order.eu.ovhcloud.com/en-ie/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      IT: `https://order.eu.ovhcloud.com/it/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      MA: `https://order.eu.ovhcloud.com/ma/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      NL: `https://order.eu.ovhcloud.com/nl/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      PL: `https://order.eu.ovhcloud.com/pl/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      PT: `https://order.eu.ovhcloud.com/pt/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      SN: `https://order.eu.ovhcloud.com/sn/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      TN: `https://order.eu.ovhcloud.com/tn/express/#/new/express/resume?products=~(${vrackProductSettings})`,
    },
    cloud_disk_array: {
      FR: 'https://www.ovhcloud.com/fr/storage-solutions/cloud-disk-array/',
    },
    veeam_enterprise: {
      DE: 'https://www.ovhcloud.com/de/storage-solutions/veeam-enterprise/',
      ES: 'https://www.ovhcloud.com/es-es/storage-solutions/veeam-enterprise/',
      FR: 'https://www.ovhcloud.com/fr/storage-solutions/veeam-enterprise/',
      GB: 'https://www.ovhcloud.com/en-gb/storage-solutions/veeam-enterprise/',
      IT: 'https://www.ovhcloud.com/it/storage-solutions/veeam-enterprise/',
      NL: 'https://www.ovhcloud.com/nl/storage-solutions/veeam-enterprise/',
      PL: 'https://www.ovhcloud.com/pl/storage-solutions/veeam-enterprise/',
      PT: 'https://www.ovhcloud.com/pt/storage-solutions/veeam-enterprise/',
    },
    load_balancer: {
      DE: 'https://www.ovhcloud.com/de/network/load-balancer/',
      ES: 'https://www.ovhcloud.com/es-es/network/load-balancer/',
      FR: 'https://www.ovhcloud.com/fr/network/load-balancer/',
      GB: 'https://www.ovhcloud.com/en-gb/network/load-balancer/',
      IE: 'https://www.ovhcloud.com/en-ie/network/load-balancer/',
      IT: 'https://www.ovhcloud.com/it/network/load-balancer/',
      MA: 'https://www.ovhcloud.com/fr-ma/network/load-balancer/',
      NL: 'https://www.ovhcloud.com/nl/network/load-balancer/',
      PL: 'https://www.ovhcloud.com/pl/network/load-balancer/',
      PT: 'https://www.ovhcloud.com/pt/network/load-balancer/',
      SN: 'https://www.ovhcloud.com/fr-sn/network/load-balancer/',
      TN: 'https://www.ovhcloud.com/fr-tn/network/load-balancer/',
    },
    dedicatedOrder: {
      DE: 'https://www.ovhcloud.com/de/bare-metal/prices/',
      ES: 'https://www.ovhcloud.com/es-es/bare-metal/prices/',
      FR: 'https://www.ovhcloud.com/fr/bare-metal/prices/',
      GB: 'https://www.ovhcloud.com/en-gb/bare-metal/prices/',
      IE: 'https://www.ovhcloud.com/en-ie/bare-metal/prices/',
      IT: 'https://www.ovhcloud.com/it/bare-metal/prices/',
      NL: 'https://www.ovhcloud.com/nl/bare-metal/prices/',
      PL: 'https://www.ovhcloud.com/pl/bare-metal/prices/',
      PT: 'https://www.ovhcloud.com/pt/bare-metal/prices/',
    },
    dedicatedEcoRangeOrder: {
      DE: 'https://eco.ovhcloud.com/de/',
      ES: 'https://eco.ovhcloud.com/es-es/',
      FR: 'https://eco.ovhcloud.com/fr/',
      GB: 'https://eco.ovhcloud.com/en-gb/',
      IE: 'https://eco.ovhcloud.com/en-ie/',
      IT: 'https://eco.ovhcloud.com/it/',
      NL: 'https://eco.ovhcloud.com/nl/',
      PL: 'https://eco.ovhcloud.com/pl/',
      PT: 'https://eco.ovhcloud.com/pt/',
      MA: 'https://eco.ovhcloud.com/fr-ma/',
      SN: 'https://eco.ovhcloud.com/fr-sn/',
      TN: 'https://eco.ovhcloud.com/fr-tn/',
    },
    express_review_base: {
      DE: 'https://order.eu.ovhcloud.com/de/express/#/express/review',
      ES: 'https://order.eu.ovhcloud.com/es/express/#/express/review',
      FR: 'https://order.eu.ovhcloud.com/fr/express/#/express/review',
      GB: 'https://order.eu.ovhcloud.com/en-gb/express/#/express/review',
      IE: 'https://order.eu.ovhcloud.com/en-ie/express/#/express/review',
      IT: 'https://order.eu.ovhcloud.com/it/express/#/express/review',
      NL: 'https://order.eu.ovhcloud.com/nl/express/#/express/review',
      PL: 'https://order.eu.ovhcloud.com/pl/express/#/express/review',
      PT: 'https://order.eu.ovhcloud.com/pt/express/#/express/review',
      MA: 'https://order.eu.ovhcloud.com/ma/express/#/express/review',
      SN: 'https://order.eu.ovhcloud.com/sn/express/#/express/review',
      TN: 'https://order.eu.ovhcloud.com/tn/express/#/express/review',
    },
    vps: {
      DE: 'https://www.ovhcloud.com/de/vps/',
      ES: 'https://www.ovhcloud.com/es-es/vps/',
      FR: 'https://www.ovhcloud.com/fr/vps/',
      GB: 'https://www.ovhcloud.com/en-gb/vps/',
      IE: 'https://www.ovhcloud.com/en-ie/vps/',
      IT: 'https://www.ovhcloud.com/it/vps/',
      NL: 'https://www.ovhcloud.com/nl/vps/',
      PL: 'https://www.ovhcloud.com/pl/vps/',
      PT: 'https://www.ovhcloud.com/pt/vps/',
      MA: 'https://www.ovhcloud.com/fr-ma/vps/',
      SN: 'https://www.ovhcloud.com/fr-sn/vps/',
      TN: 'https://www.ovhcloud.com/fr-tn/vps/',
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
      DE: 'https://order.eu.ovhcloud.com/de/webcloud/',
      ES: 'https://order.eu.ovhcloud.com/es/webcloud/',
      FR: 'https://order.eu.ovhcloud.com/fr/webcloud/',
      GB: 'https://order.eu.ovhcloud.com/en-gb/webcloud/',
      IE: 'https://order.eu.ovhcloud.com/en-ie/webcloud/',
      IT: 'https://order.eu.ovhcloud.com/it/webcloud/',
      NL: 'https://order.eu.ovhcloud.com/nl/webcloud/',
      PL: 'https://order.eu.ovhcloud.com/pl/webcloud/',
      PT: 'https://order.eu.ovhcloud.com/pt/webcloud/',
    },
    orderHosting: {
      CA: 'https://www.ovhcloud.com/en-ca/',
      DE: 'https://www.ovhcloud.com/de/web-hosting/',
      EN: 'https://www.ovhcloud.com/en-gb/web-hosting/',
      ES: 'https://www.ovhcloud.com/es-es/web-hosting/',
      FR: 'https://www.ovhcloud.com/fr/web-hosting/',
      GB: 'https://www.ovhcloud.com/en-gb/web-hosting/',
      IE: 'https://www.ovhcloud.com/en-ie/web-hosting/',
      IT: 'https://www.ovhcloud.com/it/web-hosting/',
      MA: 'https://www.ovhcloud.com/fr-ma/web-hosting/',
      NL: 'https://www.ovhcloud.com/nl/web-hosting/',
      PL: 'https://www.ovhcloud.com/pl/web-hosting/',
      PT: 'https://www.ovhcloud.com/pt/web-hosting/',
      QC: 'https://www.ovhcloud.com/fr-ca/',
      RU: 'https://www.ovhcloud.com/en-ie/web-hosting/',
      SN: 'https://www.ovhcloud.com/fr-sn/web-hosting/',
      TN: 'https://www.ovhcloud.com/fr-tn/web-hosting/',
      WE: 'https://us.ovhcloud.com/',
    },
    orderCloudWeb: {
      DE: 'https://www.ovhcloud.com/de/web-hosting/cloud-web-offer/',
      EN: 'https://www.ovhcloud.com/en-gb/web-hosting/cloud-web-offer/',
      ES: 'https://www.ovhcloud.com/es-es/web-hosting/cloud-web-offer/',
      FR: 'https://www.ovhcloud.com/fr/web-hosting/cloud-web-offer/',
      GB: 'https://www.ovhcloud.com/en-gb/web-hosting/cloud-web-offer/',
      IE: 'https://www.ovhcloud.com/en-ie/web-hosting/cloud-web-offer/',
      IT: 'https://www.ovhcloud.com/it/web-hosting/cloud-web-offer/',
      MA: 'https://www.ovhcloud.com/fr-ma/web-hosting/cloud-web-offer/',
      NL: 'https://www.ovhcloud.com/nl/web-hosting/cloud-web-offer/',
      PL: 'https://www.ovhcloud.com/pl/web-hosting/cloud-web-offer/',
      PT: 'https://www.ovhcloud.com/pt/web-hosting/cloud-web-offer/',
      SN: 'https://www.ovhcloud.com/fr-sn/web-hosting/cloud-web-offer/',
      TN: 'https://www.ovhcloud.com/fr-tn/web-hosting/cloud-web-offer/',
    },
    orderEmailPro: {
      DE: 'https://www.ovhcloud.com/de/emails/email-pro/',
      ES: 'https://www.ovhcloud.com/es-es/emails/email-pro/',
      FR: 'https://www.ovhcloud.com/fr/emails/email-pro/',
      GB: 'https://www.ovhcloud.com/en-gb/emails/email-pro/',
      IT: 'https://www.ovhcloud.com/it/emails/email-pro/',
      NL: 'https://www.ovhcloud.com/nl/emails/email-pro/',
      PL: 'https://www.ovhcloud.com/pl/emails/email-pro/',
      PT: 'https://www.ovhcloud.com/pt/emails/email-pro/',
    },
    orderOffice: {
      DE: 'https://www.ovhcloud.com/de/microsoft-365/',
      ES: 'https://www.ovhcloud.com/es-es/microsoft-365/',
      FR: 'https://www.ovhcloud.com/fr/microsoft-365/',
      GB: 'https://www.ovhcloud.com/en-gb/microsoft-365/',
      IT: 'https://www.ovhcloud.com/it/microsoft-365/',
      NL: 'https://www.ovhcloud.com/nl/microsoft-365/',
      PL: 'https://www.ovhcloud.com/pl/microsoft-365/',
      PT: 'https://www.ovhcloud.com/pt/microsoft-365/',
    },
    orderCsp2: {
      DE: 'https://www.ovh.com/manager/sunrise/index.html#/csp2',
      ES: 'https://www.ovh.com/manager/sunrise/index.html#/csp2',
      FR: 'https://www.ovh.com/manager/sunrise/index.html#/csp2',
      GB: 'https://www.ovh.com/manager/sunrise/index.html#/csp2',
      IT: 'https://www.ovh.com/manager/sunrise/index.html#/csp2',
      NL: 'https://www.ovh.com/manager/sunrise/index.html#/csp2',
      PL: 'https://www.ovh.com/manager/sunrise/index.html#/csp2',
      PT: 'https://www.ovh.com/manager/sunrise/index.html#/csp2',
    },
    ovh_cloud_connect: {
      FR: 'https://www.ovhcloud.com/fr/network/ovhcloud-connect/',
      GB: 'https://www.ovhcloud.com/en/network/ovhcloud-connect/',
    },
    dbaas_logs: {
      EU: 'https://www.ovh.com/manager/#/dedicated/dbaas/logs',
    },
    faxOrder: {
      FR: 'https://www.ovhcloud.com/fr/fax/',
    },
    smsHlr: {
      FR: 'https://www.ovhcloud.com/fr/sms/home-location-register/',
    },
    office365_business: {
      ES: 'https://www.ovhcloud.com/es-es/microsoft-365/',
      FR: 'https://www.ovhcloud.com/fr/microsoft-365/',
    },
    office365_sharepoint: {
      ES: 'https://www.ovhcloud.com/es-es/microsoft-365/?range=mail',
      FR: 'https://www.ovhcloud.com/fr/microsoft-365/?range=mail',
    },
    email_exchange: {
      ES: 'https://www.ovhcloud.com/es-es/emails/hosted-exchange/',
      FR: 'https://www.ovhcloud.com/fr/emails/hosted-exchange/',
    },
    email_sharepoint: {
      ES: 'https://www.ovhcloud.com/es-es/microsoft-365/?range=mail',
      FR: 'https://www.ovhcloud.com/fr/microsoft-365/?range=mail',
    },
    telephony_accessory_order: {
      FR: 'https://www.ovhtelecom.fr/manager/#/telecom/orders/accessories',
    },
    telephony_voip: {
      FR: 'https://www.ovhcloud.com/fr/phone/voip/',
    },
    telephony_siptrunk: {
      FR: 'https://www.ovhcloud.com/fr/phone/sip-trunk/',
    },
    telephony_siptrunkCall: {
      FR: 'https://www.ovhcloud.com/fr/phone/sip-trunk/',
    },
    internet_xdsl: {
      FR: 'https://www.ovhcloud.com/fr/internet/',
    },
    internet_fiber: {
      FR: 'https://www.ovhcloud.com/fr/internet/fibre/',
    },
    internet_sdsl: {
      FR: 'https://www.ovhcloud.com/fr/internet/',
    },
    internet_adsl_creation: {
      FR: 'https://www.ovhcloud.com/fr/internet/',
    },
    internet_otb: {
      FR: 'https://www.ovhcloud.com/fr/internet/overthebox/',
    },
    domain: {
      ES: 'https://www.ovhcloud.com/es-es/domains/',
      FR: 'https://www.ovhcloud.com/fr/domains/tld/',
    },
    dedicatedNutanixOrder: {
      DE: 'https://www.ovhcloud.com/de/hosted-private-cloud/nutanix/',
      ES: 'https://www.ovhcloud.com/es-es/hosted-private-cloud/nutanix/',
      FR: 'https://www.ovhcloud.com/fr/hosted-private-cloud/nutanix/',
      GB: 'https://www.ovhcloud.com/en-gb/hosted-private-cloud/nutanix/',
      IE: 'https://www.ovhcloud.com/en-ie/hosted-private-cloud/nutanix/',
      IT: 'https://www.ovhcloud.com/it/hosted-private-cloud/nutanix/',
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
      ASIA: 'https://order.ca.ovhcloud.com/asia/webcloud/',
      IN: 'https://order.ca.ovhcloud.com/in/webcloud/',
      AU: 'https://order.ca.ovhcloud.com/au/webcloud/',
      CA: 'https://order.ca.ovhcloud.com/en/webcloud/',
      QC: 'https://order.ca.ovhcloud.com/fr/webcloud/',
      SG: 'https://order.ca.ovhcloud.com/sg/webcloud/',
      WE: 'https://order.ca.ovhcloud.com/us/webcloud/',
      WS: 'https://order.ca.ovhcloud.com/es/webcloud/',
    },
    orderHosting: {
      ASIA: 'https://www.ovhcloud.com/asia/web-hosting/',
      IN: 'https://www.ovhcloud.com/en-in/web-hosting/',
      AU: 'https://www.ovhcloud.com/en-au/web-hosting/',
      CA: 'https://www.ovhcloud.com/en-ca/web-hosting/',
      QC: 'https://www.ovhcloud.com/fr-ca/web-hosting/',
      SG: 'https://www.ovhcloud.com/en-sg/web-hosting/',
      WE: 'https://www.ovhcloud.com/en/web-hosting/',
      WS: 'https://www.ovhcloud.com/es/web-hosting/',
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
      CA: 'https://ca.ovh.com/manager/#/dedicated/dbaas/logs',
    },
    veeam: {},
    veeam_enterprise: {
      CA: 'https://www.ovhcloud.com/en-ca/storage-solutions/veeam-enterprise/',
      QC: 'https://www.ovhcloud.com/fr-ca/storage-solutions/veeam-enterprise/',
      IN: 'https://www.ovhcloud.com/en-in/storage-solutions/veeam-enterprise/',
    },
    vrack: {
      ASIA: `https://order.ca.ovhcloud.com/asia/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      IN: `https://order.ca.ovhcloud.com/in/express/#/express/review?products=~(${vrackProductSettings})`,
      AU: `https://order.ca.ovhcloud.com/au/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      CA: `https://order.ca.ovhcloud.com/en/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      QC: `https://order.ca.ovhcloud.com/fr/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      SG: `https://order.ca.ovhcloud.com/sg/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      WE: `https://order.ca.ovhcloud.com/us/express/#/new/express/resume?products=~(${vrackProductSettings})`,
      WS: `https://order.ca.ovhcloud.com/es/express/#/new/express/resume?products=~(${vrackProductSettings})`,
    },
    load_balancer: {
      ASIA: 'https://www.ovhcloud.com/asia/network/load-balancer/',
      IN: 'https://www.ovhcloud.com/en-in/network/load-balancer/',
      AU: 'https://www.ovhcloud.com/en-au/network/load-balancer/',
      CA: 'https://www.ovhcloud.com/en-ca/network/load-balancer/',
      QC: 'https://www.ovhcloud.com/fr-ca/network/load-balancer/',
      SG: 'https://www.ovhcloud.com/en-sg/network/load-balancer/',
      WE: 'https://www.ovhcloud.com/en/network/load-balancer/',
      WS: 'https://www.ovhcloud.com/es/network/load-balancer/',
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
      CA: 'https://ca.ovh.com/manager/#/public-cloud/pci/projects/default/kubernetes/new',
    },
    express_review_base: {
      ASIA: 'https://order.ca.ovhcloud.com/asia/express/#/express/review',
      IN: 'https://order.ca.ovhcloud.com/in/express/#/express/review',
      AU: 'https://order.ca.ovhcloud.com/au/express/#/express/review',
      CA: 'https://order.ca.ovhcloud.com/en/express/#/express/review',
      QC: 'https://order.ca.ovhcloud.com/fr/express/#/express/review',
      SG: 'https://order.ca.ovhcloud.com/sg/express/#/express/review',
      WE: 'https://order.ca.ovhcloud.com/us/express/#/express/review',
      WS: 'https://order.ca.ovhcloud.com/es/express/#/express/review',
    },
    vps: {
      ASIA: 'https://www.ovhcloud.com/asia/vps/',
      IN: 'https://www.ovhcloud.com/en-in/vps/',
      AU: 'https://www.ovhcloud.com/en-au/vps/',
      CA: 'https://www.ovhcloud.com/en-ca/vps/',
      QC: 'https://www.ovhcloud.com/fr-ca/vps/',
      SG: 'https://www.ovhcloud.com/en-sg/vps/',
      WE: 'https://www.ovhcloud.com/en/vps/',
      WS: 'https://www.ovhcloud.com/es/vps/',
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
      US: 'https://us.ovhcloud.com/storage-solutions/veeam-enterprise/',
    },
    vrack: {
      US: `https://order.us.ovhcloud.com/en/express/#/express/review?products=~(~${vrackProductSettings})`,
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
      US: 'https://us.ovhcloud.com/manager/#/public-cloud/pci/projects/default/kubernetes/new',
    },
    express_review_base: {
      US: 'https://order.us.ovhcloud.com/en/express/#/express/review',
    },
    vps: {
      US: 'https://us.ovhcloud.com/vps/',
    },
    ovh_cloud_connect: {
      US: 'https://us.ovhcloud.com/network/ovhcloud-connect/',
    },
  },
};

export const EXPRESS_ORDER_URLS = {
  EU: {
    DE: 'https://order.eu.ovhcloud.com/de/express/#/express/review',
    EN: 'https://order.eu.ovhcloud.com/en-gb/express/#/express/review',
    ES: 'https://order.eu.ovhcloud.com/es/express/#/express/review',
    FR: 'https://order.eu.ovhcloud.com/fr/express/#/express/review',
    GB: 'https://order.eu.ovhcloud.com/en-gb/express/#/express/review',
    IE: 'https://order.eu.ovhcloud.com/en-ie/express/#/express/review',
    IT: 'https://order.eu.ovhcloud.com/it/express/#/express/review',
    MA: 'https://order.eu.ovhcloud.com/ma/express/#/express/review',
    NL: 'https://order.eu.ovhcloud.com/nl/express/#/express/review',
    PL: 'https://order.eu.ovhcloud.com/pl/express/#/express/review',
    PT: 'https://order.eu.ovhcloud.com/pt/express/#/express/review',
    SN: 'https://order.eu.ovhcloud.com/sn/express/#/express/review',
    TN: 'https://order.eu.ovhcloud.com/tn/express/#/express/review',
    DEFAULT: 'https://order.eu.ovhcloud.com/en-ie/express/#/express/review',
  },
  CA: {
    ASIA: 'https://order.ca.ovhcloud.com/asia/express/#/express/review',
    IN: 'https://order.ca.ovhcloud.com/in/express/#/express/review',
    AU: 'https://order.ca.ovhcloud.com/au/express/#/express/review',
    CA: 'https://order.ca.ovhcloud.com/en/express/#/express/review',
    QC: 'https://order.ca.ovhcloud.com/fr/express/#/express/review',
    SG: 'https://order.ca.ovhcloud.com/sg/express/#/express/review',
    WE: 'https://order.ca.ovhcloud.com/us/express/#/express/review',
    WS: 'https://order.ca.ovhcloud.com/es/express/#/express/review',
    DEFAULT: 'https://order.ca.ovhcloud.com/us/express/#/express/review',
  },
  US: {
    DEFAULT: 'https://order.us.ovhcloud.com/en/express/#/express/review',
  },
};

export type Regions = keyof typeof ORDER_URLS; // "EU" | "CA" | "US"
export type Products<R extends Regions> = keyof (typeof ORDER_URLS)[R]; // e.g. "DEDICATED" | "vrack"
export type Subsidiaries<
  R extends Regions,
  P extends Products<R>,
> = keyof (typeof ORDER_URLS)[R][P]; // e.g. "FR" | "DE" | "US" | "CA"

export function getOrderURL<R extends Regions, P extends Products<R>>(
  product: P,
  region: R,
  subsidiary: string,
): string {
  const urls = ORDER_URLS[region]?.[product] as Record<string, string> | undefined;
  if (urls) {
    const fallbackMap: Partial<Record<Regions, string>> = {
      EU: 'FR',
      CA: 'CA',
      US: 'US',
    };
    const fallback = fallbackMap[region];
    return urls[subsidiary] ?? (fallback ? (urls[fallback] ?? '') : '');
  }
  return '';
}

export function getExpressOrderURL(region: string, subsidiary: string): string {
  const regionURLs = EXPRESS_ORDER_URLS[region as keyof typeof EXPRESS_ORDER_URLS];
  return regionURLs?.[subsidiary as keyof typeof regionURLs] || regionURLs?.DEFAULT;
}
