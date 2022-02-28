export default {
  id: 'services',
  translation: 'sidebar_services',
  children: [
    {
      id: 'dedicated',
      translation: 'sidebar_dedicated_vps',
      children: [
        {
          id: 'dedicated-servers',
          translation: 'sidebar_dedicated',
          serviceType: 'DEDICATED_SERVER',
          routing: {
            application: 'dedicated',
            hash: '#/server',
          },
        },
        {
          id: 'vps',
          translation: 'sidebar_vps',
          serviceType: 'VPS',
          routing: {
            application: 'dedicated',
            hash: '#/vps',
          },
        },
        {
          id: 'managed-bare-metal',
          translation: 'sidebar_dedicated_cloud',
          serviceType: 'DEDICATEDCLOUD',
          routing: {
            application: 'dedicated',
            hash: '#/managedBaremetal',
          },
        },
        {
          id: 'dedicated-licences',
          translation: 'sidebar_licences',
          serviceType: [
            'LICENSE_CLOUDLINUX',
            'LICENSE_CPANEL',
            'LICENSE_DIRECTADMIN',
            'LICENSE_PLESK',
            'LICENSE_SPLA',
            'LICENSE_SQLSERVER',
            'LICENSE_VIRTUOZZO',
            'LICENSE_WINDOWS',
            'LICENSE_WORKLIGHT',
          ],
          routing: {
            application: 'dedicated',
            hash: '#/license',
          },
        },
      ],
    },
    {
      id: 'hosted-private-cloud',
      translation: 'sidebar_hpc',
      children: [
        {
          id: 'vm-ware',
          translation: 'sidebar_vmware',
          routing: {
            application: 'dedicated',
          },
        },
        {
          id: 'anthos',
          translation: 'sidebar_anthos',
          serviceType: 'DEDICATED_ANTHOS_TENANTS',
          routing: {
            application: 'dedicated',
            hash: '#/anthos',
          },
        },
        {
          id: 'veeam-enterprise',
          translation: 'sidebar_veeam_enterprise',
          serviceType: 'VEEAM_VEEAMENTERPRISE',
          routing: {
            application: 'dedicated',
            hash: '#/veeam-enterprise',
          },
        },
      ],
    },
    {
      id: 'public-cloud',
      translation: 'sidebar_pci',
      children: [],
    },
    {
      id: 'storage',
      translation: 'sidebar_storage',
      children: [
        {
          id: 'nasha',
          translation: 'sidebar_nasha',
          serviceType: 'DEDICATED_NASHA',
          routing: {
            application: 'dedicated',
            hash: '#/nasha',
          },
        },
        {
          id: 'netapp',
          translation: 'sidebar_netapp',
          serviceType: 'STORAGE_NETAPP',
          routing: {
            application: 'dedicated',
            hash: '#/netapp',
          },
        },
        {
          id: 'cloud-disk-array',
          translation: 'sidebar_cda',
          routing: {
            application: 'dedicated',
            hash: '#/cda',
          },
        },
        {
          id: 'veeam-cloud-connect',
          translation: 'sidebar_veeamcc',
          serviceType: 'VEEAMCLOUDCONNECT',
          routing: {
            application: 'dedicated',
            hash: '#/veeam',
          },
        },
      ],
    },
    {
      id: 'databases',
      translation: 'sidebar_databases',
      serviceType: 'HOSTING_PRIVATEDATABASE',
      children: [
        {
          id: 'metrics-data-platform',
          translation: 'sidebar_metrics',
        },
        {
          id: 'logs-data-platform',
          translation: 'sidebar_logs_db',
        },
        {
          id: 'enterprise-cloud-db',
          translation: 'sidebar_enterprise_cloud_db',
          routing: {
            application: 'dedicated',
            hash: '#/enterprise-cloud-database',
          },
        },
      ],
    },
    {
      id: 'network-security',
      translation: 'sidebar_network',
      children: [
        {
          id: 'vrack',
          translation: 'sidebar_vrack',
          serviceType: 'VRACK',
          routing: {
            application: 'dedicated',
            hash: '#/vrack',
          },
        },
        {
          id: 'ovhcloud-connect',
          translation: 'sidebar_cloud_connect',
          serviceType: 'OVHCLOUDCONNECT',
          routing: {
            application: 'dedicated',
            hash: '#/cloud-connect',
          },
        },
        {
          id: 'iplb',
          translation: 'sidebar_iplb',
          serviceType: 'IPLOADBALANCING',
          routing: {
            application: 'dedicated',
            hash: '#/iplb',
          },
        },
        {
          id: 'ip',
          translation: 'sidebar_ip',
          serviceType: 'IP_SERVICE',
          routing: {
            application: 'dedicated',
            hash: '#/ip',
          },
        },
        {
          id: 'cdn',
          translation: 'sidebar_cdn',
          serviceType: 'CDN_DEDICATED',
          routing: {
            application: 'dedicated',
            hash: '#/configuration/cdn',
          },
        },
      ],
    },
    {
      id: 'domain-dns',
      translation: 'sidebar_domain_dns',
      children: [
        {
          id: 'domains',
          translation: 'sidebar_domain',
          serviceType: 'DOMAIN',
          routing: {
            application: 'web',
            hash: '#/domain',
          },
        },
        {
          id: 'dns',
          translation: 'sidebar_dns',
          serviceType: 'DOMAIN_ZONE',
          routing: {
            application: 'web',
            hash: '#/zone',
          },
        },
      ],
    },
    {
      id: 'web-hosting',
      translation: 'sidebar_web_hosting',
      children: [
        {
          id: 'hosting',
          translation: 'sidebar_hosting',
          serviceType: 'HOSTING_WEB',
          routing: {
            application: 'web',
            hash: '#/hosting',
          },
        },
        {
          id: 'web-databases',
          translation: 'sidebar_web_db',
          serviceType: 'HOSTING_PRIVATEDATABASE',
          routing: {
            application: 'web',
            hash: '#/private_database',
          },
        },
      ],
    },
    {
      id: 'web-paas',
      translation: 'sidebar_web_paas',
      children: [
        {
          id: 'platform-sh',
          translation: 'sidebar_platform_sh',
          serviceType: 'WEBPAAS_SUBSCRIPTION',
          routing: {
            application: 'web',
            hash: '#/paas/webpaas/projects',
          },
        },
      ],
    },
    {
      id: 'emails',
      label: 'Emails',
      translation: 'sidebar_emails',
      children: [
        {
          id: 'email-pro',
          translation: 'sidebar_email_pro',
          serviceType: 'EMAIL_PRO',
          routing: {
            application: 'web',
            hash: '#/email_pro',
          },
        },
        {
          id: 'exchange',
          translation: 'sidebar_exchange',
          serviceType: 'EMAIL_EXCHANGE_SERVICE',
          routing: {
            application: 'web',
            hash: '#/exchange',
          },
        },
        {
          id: 'mxplan',
          translation: 'sidebar_mxplan',
          serviceType: 'EMAIL_DOMAIN',
          routing: {
            application: 'web',
            hash: '#/email_domain',
          },
        },
      ],
    },
    {
      id: 'tools',
      translation: 'sidebar_tools',
      children: [
        {
          id: 'office',
          translation: 'sidebar_license_office',
          serviceType: 'LICENSE_OFFICE',
          routing: {
            application: 'web',
            hash: '#/office/license',
          },
        },
        {
          id: 'sharepoint',
          translation: 'sidebar_sharepoint',
          serviceType: 'MSSERVICES_SHAREPOINT',
          routing: {
            application: 'web',
            hash: '#/sharepoint',
          },
        },
      ],
    },
    {
      id: 'internet',
      translation: 'sidebar_internet',
      children: [
        {
          id: 'packs',
          translation: 'sidebar_packs_xdsl',
          serviceType: 'PACK_XDSL',
          routing: {
            application: 'telecom',
            hash: '#/pack',
          },
        },
        {
          id: 'line',
          translation: 'sidebar_internet_line',
          serviceType: 'TELEPHONY_LINES',
          routing: {
            application: 'telecom',
          },
        },
        {
          id: 'otb',
          translation: 'sidebar_otb',
          routing: {
            application: 'telecom',
            hash: '#/overTheBox',
          },
        },
      ],
    },
    {
      id: 'telephony',
      translation: 'sidebar_telephony',
      children: [
        {
          id: 'voipgroup',
          translation: 'sidebar_telephony_voip_groups',
          serviceType: 'TELEPHONY',
          routing: {
            application: 'telecom',
            hash: '#/telephony',
          },
        },
        {
          id: 'sms',
          translation: 'sidebar_telephony_sms',
          serviceType: 'SMS',
          routing: {
            application: 'telecom',
            hash: '#/sms',
          },
        },
      ],
    },
  ],
};
