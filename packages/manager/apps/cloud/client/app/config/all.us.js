export const REDIRECT_URLS = {
  support: 'https://us.ovhcloud.com/manager/dedicated/index.html#/support',
  billing:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/history',
  billingPayments:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/payments',
  billingMean:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/mean',
  billingVouchers:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/vouchers',
  billingRefunds:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/refunds',
  billingFidelity:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/fidelity',
  billingCredits:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/credits',
  ordersInProgress:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/orders?status=in-progress',
  orders:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/orders?status=all',
  services:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/autoRenew',
  servicesAgreements:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/useraccount/agreements',
  paymentMeans:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/mean',
  addCreditCard:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/mean/add?meanType=creditCard',
  ovhAccount:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/ovhaccount',
  debtAccount:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/billing/statements',
  userInfos:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/useraccount/infos',
  userSecurity:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/useraccount/security',
  userEmails:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/useraccount/emails',
  userSubscriptions:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/useraccount/subscriptions',
  userSSH:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/useraccount/ssh',
  userAdvanced:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/useraccount/advanced',
  contacts: null, // not yet available to US users
  horizon:
    'https://horizon.cloud.ovh.us/openstackdashboard?username={username}',
  ipAction:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/configuration/ip?action={action}&ip={ip}&ipBlock={ipBlock}',
  vRack:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/configuration/vrack?landingTo=networks',
  nas:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/configuration/nas?landingTo=networks',
  nasPage:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/configuration/nas/nas/nas_{nas}?landingTo=networks',
  ip:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/configuration/ip?landingTo=ip&serviceName={serviceName}',
  license:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/configuration/license?landingTo=licences',
  housing:
    'https://www.ovh.com/manager/dedicated/index.html#/housing/{housing}?landingTo=dedicatedServers',
  dedicatedServers:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/configuration?landingTo=dedicatedServers',
  dedicatedServersPage:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/configuration/server/{server}?landingTo=dedicatedServers',
  dedicatedCloud:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/configuration?landingTo=dedicatedClouds',
  dedicatedCloudPage:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/configuration/dedicated_cloud/{pcc}?landingTo=dedicatedClouds',
  cloudDesktop: null, // not yet available to US users
  vps:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/configuration?landingTo=vps',
  vpsPage:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/configuration/vps/{vps}?landingTo=vps',
  networks:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/configuration?landingTo=networks',
  cdnPage:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/configuration/cdn/{cdn}?landingTo=networks',
  renew:
    'https://us.ovhcloud.com/cgi-bin/order/renew.cgi?domainChooser={serviceName}',
  licensePage:
    'https://us.ovhcloud.com/manager/dedicated/index.html#/configuration/license/{license}/detail',
};

export const URLS = {
  support: {
    US: 'https://us.ovhcloud.com/support/',
  },
  support_contact: {
    US: 'https://us.ovhcloud.com/support/',
  },
  website_order: {
    'cloud-resell-eu': {
      US: (projectName) =>
        `https://us.ovhcloud.com/order/express/#/express/review?products=~(~(planCode~'project~productId~'cloud~quantity~1~duration~'P1M~configuration~(~(label~'description~values~(~'${encodeURIComponent(
          projectName,
        )})))))`,
    },
    dedicated_server: {
      US: 'https://us.ovhcloud.com/order/dedicated/#/dedicated/select',
    },
    dedicated_cloud: {
      US: 'https://us.ovhcloud.com/dedicated-cloud/',
    },
    load_balancer: {
      US: 'https://us.ovhcloud.com/solutions/ip-load-balancing/',
    },
    pcs: {
      US:
        'https://support.us.ovhcloud.com/hc/en-us/sections/115000624590-Storage',
    },
    pca: {
      US:
        'https://support.us.ovhcloud.com/hc/en-us/sections/115000624590-Storage',
    },
    vrack: {
      US:
        "https://us.ovhcloud.com/order/express/#/express/review?products=~(~(planCode~'vrack~quantity~1~productId~'vrack))",
    },
    cloud_disk_array: {
      US: 'https://us.ovhcloud.com/cloud/cloud-disk-array/',
    },
    ip: {
      US:
        'https://us.ovhcloud.com/manager/dedicated/index.html#/configuration/ip/agoraOrder',
    },
    veeam: {},
    veeam_enterprise: {},
    cloud_desktop: {},
    dbaas_logs: {},
    express_base: {
      US: 'https://us.ovhcloud.com/order/express/#/express/review',
    },
    express_review_base: {
      US: 'https://us.ovhcloud.com/order/express/#/express/review',
    },
  },
  guides: {
    home: {
      US: 'https://docs.us.ovhcloud.com',
    },
    cda: {},
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
    vmResize: {},
    cloud: {
      US: 'https://support.us.ovhcloud.com/hc/en-us',
    },
    vlans: {},
    vrack: {},
    rCloneFile: {},
    ssh: {
      create: {
        US: 'https://support.us.ovhcloud.com/hc/en-us/articles/115001588250',
      },
      add: {
        US: 'https://us.ovhcloud.com/g1924.configuring_additionnal_ssh_key',
      },
      change: {
        US: 'https://us.ovhcloud.com/g2069.replacing_your_lost_ssh_key_pair',
      },
    },
  },
};

export default { REDIRECT_URLS, URLS };
