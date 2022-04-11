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
        },
        {
          id: 'vps',
          translation: 'sidebar_vps',
          serviceType: 'VPS',
        },
        {
          id: 'managed-bare-metal',
          translation: 'sidebar_dedicated_cloud',
          serviceType: 'DEDICATEDCLOUD',
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
        },
        {
          id: 'anthos',
          translation: 'sidebar_anthos',
          serviceType: 'DEDICATED_ANTHOS_TENANTS',
        },
        {
          id: 'veeam-enterprise',
          translation: 'sidebar_veeam_enterprise',
          serviceType: 'VEEAM_VEEAMENTERPRISE',
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
        },
        {
          id: 'netapp',
          translation: 'sidebar_netapp',
          serviceType: 'STORAGE_NETAPP',
        },
        {
          id: 'cloud-disk-array',
          translation: 'sidebar_cda',
        },
        {
          id: 'veeam-cloud-connect',
          translation: 'sidebar_veeamcc',
          serviceType: 'VEEAMCLOUDCONNECT',
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
        },
        {
          id: 'ovhcloud-connect',
          translation: 'sidebar_cloud_connect',
          serviceType: 'OVHCLOUDCONNECT',
        },
        {
          id: 'iplb',
          translation: 'sidebar_iplb',
          serviceType: 'IPLOADBALANCING',
        },
        {
          id: 'ip',
          translation: 'sidebar_ip',
          serviceType: 'IP_SERVICE',
        },
        {
          id: 'cdn',
          translation: 'sidebar_cdn',
          serviceType: 'CDN_DEDICATED',
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
        },
        {
          id: 'dns',
          translation: 'sidebar_dns',
          serviceType: 'DOMAIN_ZONE',
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
        },
        {
          id: 'web-databases',
          translation: 'sidebar_web_db',
          serviceType: 'HOSTING_PRIVATEDATABASE',
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
        },
        {
          id: 'exchange',
          translation: 'sidebar_exchange',
          serviceType: 'EMAIL_EXCHANGE_SERVICE',
        },
        {
          id: 'mxplan',
          translation: 'sidebar_mxplan',
          serviceType: 'EMAIL_DOMAIN',
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
        },
        {
          id: 'sharepoint',
          translation: 'sidebar_sharepoint',
          serviceType: 'MSSERVICES_SHAREPOINT',
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
        },
        {
          id: 'line',
          translation: 'sidebar_internet_line',
          serviceType: 'TELEPHONY_LINES',
        },
        {
          id: 'otb',
          translation: 'sidebar_otb',
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
        },
        {
          id: 'sms',
          translation: 'sidebar_telephony_sms',
          serviceType: 'SMS',
        },
      ],
    },
  ],
};
