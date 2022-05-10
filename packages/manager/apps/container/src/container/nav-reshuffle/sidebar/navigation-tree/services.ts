export default {
  id: 'services',
  translation: 'sidebar_services',
  idAttr: 'sidebar-link-services',
  children: [
    {
      id: 'baremetal-cloud',
      translation: 'sidebar_bare_metal_cloud',
      routing: {
        application: 'dedicated',
        hash: '#/configuration',
      },
      children: [
        {
          id: 'bmc-dedicated-vps',
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
              id: 'dedicated-housing',
              translation: 'sidebar_dedicated_housing',
              serviceType: 'DEDICATED_HOUSING',
              routing: {
                application: 'dedicated',
                hash: '#/housing',
              },
              hideIfEmpty: true,
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
          id: 'bmc-storage-backup',
          translation: 'sidebar_storage_backup',
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
              id: 'nas',
              translation: 'sidebar_nas',
              serviceType: 'DEDICATED_NAS',
              routing: {
                application: 'dedicated',
                hash: '#/nas',
              },
              hideIfEmpty: true,
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
              serviceType: 'DEDICATED_CEPH',
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
          id: 'bmc-databases',
          translation: 'sidebar_databases',
          children: [
            {
              id: 'pci-logs-data-platform',
              translation: 'sidebar_logs_db',
              serviceType: 'DBAAS_LOGS',
              routing: {
                application: 'dedicated',
                hash: '#/dbaas/logs',
              },
            },
            {
              id: 'enterprise-cloud-db',
              translation: 'sidebar_enterprise_cloud_db',
              serviceType: 'CLOUDDB_ENTERPRISE_CLUSTER',
              routing: {
                application: 'dedicated',
                hash: '#/enterprise-cloud-database',
              },
            },
          ],
          region: ['EU', 'CA'],
        },
      ],
    },
    {
      id: 'hosted-private-cloud',
      translation: 'sidebar_hpc',
      children: [
        {
          id: 'hpc-platforms',
          translation: 'sidebar_platforms',
          children: [
            {
              id: 'vm-ware',
              translation: 'sidebar_vmware',
              serviceType: 'DEDICATEDCLOUD_VMWARE',
              routing: {
                application: 'dedicated',
                hash: '#/dedicated_cloud',
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
              id: 'nutanix',
              translation: 'sidebar_nutanix',
              serviceType: 'NUTANIX',
              routing: {
                application: 'dedicated',
                hash: '#/nutanix',
              },
            },
            {
              id: 'hpc-licences',
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
          id: 'hpc-storage-backup',
          translation: 'sidebar_storage_backup',
          children: [
            {
              id: 'veeam-enterprise',
              translation: 'sidebar_veeam_enterprise',
              serviceType: 'VEEAM_VEEAMENTERPRISE',
              routing: {
                application: 'dedicated',
                hash: '#/veeam-enterprise',
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
      ],
    },
    {
      id: 'pci',
      translation: 'sidebar_pci',
      routing: {
        application: 'public-cloud',
        hash: '#/pci/projects/{projectId}',
      },
      children: [
        {
          id: 'pci-compute',
          translation: 'sidebar_pci_compute',
          children: [
            {
              id: 'pci-instances',
              translation: 'sidebar_pci_instances',
              serviceType: 'CLOUD_PROJECT_INSTANCE',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/instances',
              },
            },
            {
              id: 'pci-bare-metal',
              translation: 'sidebar_pci_bare_metal',
              serviceType: 'CLOUD_PROJECT_INSTANCE_BAREMETAL',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/baremetal',
              },
            },
          ],
        },
        {
          id: 'pci-storage',
          translation: 'sidebar_pci_storage',
          children: [
            {
              id: 'pci-block-storage',
              translation: 'sidebar_pci_block_storage',
              serviceType: 'CLOUD_PROJECT_VOLUME',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/storages/blocks',
              },
            },
            {
              id: 'pci-object-storage',
              translation: 'sidebar_pci_object_storage',
              serviceType: 'CLOUD_PROJECT_STORAGE',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/storages/objects',
              },
            },
            {
              id: 'pci-volume-snapshot',
              translation: 'sidebar_pci_volume_snapshot',
              serviceType: 'CLOUD_PROJECT_VOLUME_SNAPSHOT',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/storages/volume-snapshots',
              },
            },
            {
              id: 'pci-instance-backup',
              translation: 'sidebar_pci_instance_backup',
              serviceType: 'CLOUD_PROJECT_SNAPSHOT',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/storages/instance-backups',
              },
            },
            {
              id: 'pci-cloud-archive',
              translation: 'sidebar_pci_cloud_archive',
              serviceType: 'CLOUD_PROJECT_STORAGE',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/storages/cloud-archives',
              },
            },
          ],
        },
        {
          id: 'pci-network',
          translation: 'sidebar_pci_network',
          children: [
            {
              id: 'pci-load-balancer',
              translation: 'sidebar_pci_load_balancer',
              serviceType: 'CLOUD_PROJECT_LOADBALANCER',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/load-balancer',
              },
            },
            {
              id: 'pci-private-network',
              translation: 'sidebar_pci_private_network',
              serviceType: 'CLOUD_PROJECT_PRIVATE_NETWORK',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/private-networks',
              },
            },
            {
              id: 'pci-failover-ip',
              translation: 'sidebar_pci_failover_ip',
              serviceType: 'CLOUD_PROJECT_IP_FAILOVER',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/failover-ips',
              },
            },
          ],
        },
        {
          id: 'pci-containers',
          translation: 'sidebar_pci_containers',
          children: [
            {
              id: 'pci-kubernetes',
              translation: 'sidebar_pci_kubernetes',
              serviceType: 'CLOUD_PROJECT_KUBE',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/kubernetes',
              },
            },
            {
              id: 'pci-kubernetes-load-balancer',
              translation: 'sidebar_pci_kubernetes_load_balancer',
              serviceType: 'CLOUD_PROJECT_LOADBALANCER',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/load-balancer',
              },
            },
            {
              id: 'pci-private-registry',
              translation: 'sidebar_pci_private_registry',
              serviceType: 'CLOUD_PROJECT_CONTAINER_REGISTRY',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/private-registry',
              },
            },
            {
              id: 'pci-workflow',
              translation: 'sidebar_pci_workflow',
              serviceType: 'CLOUD_PROJECT_WORKFLOW_BACKUP',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/workflow',
              },
            },
          ],
        },
        {
          id: 'pci-ai',
          translation: 'sidebar_pci_ai',
          children: [
            {
              id: 'pci-ai-notebooks',
              translation: 'sidebar_pci_ai_notebooks',
              serviceType: 'CLOUD_PROJECT_AI_NOTEBOOK',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/notebooks',
              },
            },
            {
              id: 'pci-ai-training',
              translation: 'sidebar_pci_ai_training',
              serviceType: 'CLOUD_PROJECT_AI_JOB',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/training',
              },
            },
            {
              id: 'pci-ai-app',
              translation: 'sidebar_pci_ai_app',
              serviceType: 'CLOUD_PROJECT_AI_APP',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/ai',
              },
            },
            {
              id: 'pci-ml-serving',
              translation: 'sidebar_pci_ml_serving',
              serviceType: 'CLOUD_PROJECT_AI_SERVING',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/serving',
              },
            },
          ],
        },
        {
          id: 'pci-analytics',
          translation: 'sidebar_pci_analytics',
          children: [
            {
              id: 'pci-data-processing',
              translation: 'sidebar_pci_data_processing',
              serviceType: 'CLOUD_PROJECT_DATAPROCESSING_JOBS',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/data-processing',
              },
            },
            {
              id: 'pci-logs-data-platform',
              translation: 'sidebar_pci_logs_data_platform',
              serviceType: 'DBAAS_LOGS',
              routing: {
                application: 'dedicated',
                hash: '#/dbaas/logs',
              },
            },
          ],
        },
        {
          id: 'pci-management-interface',
          translation: 'sidebar_pci_management',
          count: false,
          children: [
            {
              id: 'pci-horizon',
              translation: 'sidebar_pci_horizon',
              count: false,
              url: {
                CA: 'https://horizon.cloud.ovh.net/auth/login/',
                EU: 'https://horizon.cloud.ovh.net/auth/login/',
                US: 'https://horizon.cloud.ovh.us/auth/login/',
              },
              isExternal: true,
            },
          ],
        },
        {
          id: 'pci-settings',
          translation: 'sidebar_pci_settings',
          count: false,
          children: [
            {
              id: 'pci-users-roles',
              translation: 'sidebar_pci_users_roles',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/users',
              },
              count: false,
            },
            {
              id: 'pci-quota-region',
              translation: 'sidebar_pci_quota_regions',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/quota',
              },
              count: false,
            },
            {
              id: 'pci-ssh-keys',
              translation: 'sidebar_pci_ssh_keys',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/ssh',
              },
              count: false,
            },
            {
              id: 'pci-billing',
              translation: 'sidebar_pci_billing',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/billing',
              },
              count: false,
            },
            {
              id: 'pci-credits-vouchers',
              translation: 'sidebar_pci_credits_vouchers',
              serviceType: 'CLOUD_PROJECT_CREDIT',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/vouchers',
              },
              count: false,
            },
            {
              id: 'pci-contacts-rights',
              translation: 'sidebar_pci_contacts_rights',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/contacts',
              },
              count: false,
            },
            {
              id: 'pci-project-settings',
              translation: 'sidebar_pci_project_settings',
              routing: {
                application: 'public-cloud',
                hash: '#/pci/projects/{projectId}/edit',
              },
              count: false,
            },
          ],
        },
      ],
    },
    {
      id: 'web-cloud',
      translation: 'sidebar_web_cloud',
      routing: {
        application: 'web',
        hash: '#/configuration',
      },
      children: [
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
          region: ['EU', 'CA'],
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
          region: ['EU', 'CA'],
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
          region: ['EU', 'CA'],
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
              id: 'mxplan',
              translation: 'sidebar_mxplan',
              serviceType: 'EMAIL_DOMAIN',
              routing: {
                application: 'web',
                hash: '#/email_domain',
              },
            },
          ],
          region: ['EU', 'CA'],
        },
        {
          id: 'microsoft',
          translation: 'sidebar_microsoft',
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
              id: 'exchange',
              translation: 'sidebar_exchange',
              serviceType: 'EMAIL_EXCHANGE_SERVICE',
              routing: {
                application: 'web',
                hash: '#/exchange',
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
      ],
    },
    {
      id: 'network',
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
          id: 'ip',
          translation: 'sidebar_ip',
          serviceType: 'IP_SERVICE',
          routing: {
            application: 'dedicated',
            hash: '#/ip',
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
          region: ['EU', 'CA'],
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
          id: 'cdn',
          translation: 'sidebar_cdn',
          serviceType: 'CDN_DEDICATED',
          routing: {
            application: 'dedicated',
            hash: '#/configuration/cdn',
          },
          region: ['EU', 'CA'],
        },
      ],
    },
    {
      id: 'telecom',
      translation: 'sidebar_telecom',
      routing: {
        application: 'telecom',
        hash: '#/',
      },
      children: [
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
              id: 'otb',
              translation: 'sidebar_otb',
              serviceType: 'OVERTHEBOX',
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
            {
              id: 'fax',
              translation: 'sidebar_telephony_fax',
              serviceType: 'FREEFAX',
              routing: {
                application: 'telecom',
                hash: '#/freefax',
              },
            },
          ],
        },
        {
          id: 'telecom-operations',
          translation: 'sidebar_telecom_operations',
          routing: {
            application: 'telecom',
            hash: '#/task',
          },
        },
      ],
      region: ['EU', 'CA'],
    },
  ],
};
