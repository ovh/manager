export default {
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
          id: 'pci-databases',
          translation: 'sidebar_pci_databases',
          serviceType: 'CLOUD_PROJECT_DATABASE',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/storages/databases',
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
          id: 'pci-analytics-data-platform',
          translation: 'sidebar_pci_ai_analytics_data_platform',
          serviceType: 'ANALYTICS_PLATFORMS',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/analytics-data-platform',
          },
        },
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
      children: [
        {
          id: 'pci-horizon',
          translation: 'sidebar_pci_horizon',
        },
      ],
    },
    {
      id: 'pci-projects',
      translation: 'sidebar_pci_projects',
      children: [
        {
          id: 'pci-users-roles',
          translation: 'sidebar_pci_users_roles',
          serviceType: 'CLOUD_PROJECT_USER',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/users',
          },
        },
        {
          id: 'pci-quota-region',
          translation: 'sidebar_pci_quota_regions',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/quota',
          },
        },
        {
          id: 'pci-ssh-keys',
          translation: 'sidebar_pci_ssh_keys',
          serviceType: 'CLOUD_PROJECT_SSHKEY',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/ssh',
          },
        },
        {
          id: 'pci-billing',
          translation: 'sidebar_pci_billing',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/billing',
          },
        },
        {
          id: 'pci-credits-vouchers',
          translation: 'sidebar_pci_credits_vouchers',
          serviceType: 'CLOUD_PROJECT_CREDIT',
        },
        {
          id: 'pci-contacts-rights',
          translation: 'sidebar_pci_contacts_rights',
        },
        {
          id: 'pci-project-settings',
          translation: 'sidebar_pci_project_settings',
        },
      ],
    },
  ],
};
