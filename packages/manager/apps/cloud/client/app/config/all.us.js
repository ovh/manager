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

export default { URLS };
