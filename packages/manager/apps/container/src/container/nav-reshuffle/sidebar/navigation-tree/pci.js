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
        },
        {
          id: 'pci-bare-metal',
          translation: 'sidebar_pci_bare_metal',
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
        },
        {
          id: 'pci-databases',
          translation: 'sidebar_pci_databases',
          serviceType: 'CLOUD_PROJECT_DATABASE',
        },
        {
          id: 'pci-cloud-archive',
          translation: 'sidebar_pci_cloud_archive',
          serviceType: 'CLOUD_PROJECT_STORAGE',
        },
        {
          id: 'pci-volume-snapshot',
          translation: 'sidebar_pci_volume_snapshot',
          serviceType: 'CLOUD_PROJECT_VOLUME_SNAPSHOT',
        },
        {
          id: 'pci-instance-backup',
          translation: 'sidebar_pci_instance_backup',
          serviceType: 'CLOUD_PROJECT_SNAPSHOT',
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
        },
        {
          id: 'pci-private-network',
          translation: 'sidebar_pci_private_network',
          serviceType: 'CLOUD_PROJECT_PRIVATE_NETWORK',
        },
        {
          id: 'pci-failover-ip',
          translation: 'sidebar_pci_failover_ip',
          serviceType: 'CLOUD_PROJECT_IP_FAILOVER',
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
        },
        {
          id: 'pci-private-registry',
          translation: 'sidebar_pci_private_registry',
          serviceType: 'CLOUD_PROJECT_CONTAINER_REGISTRY',
        },
        {
          id: 'pci-workflow',
          translation: 'sidebar_pci_workflow',
          serviceType: 'CLOUD_PROJECT_WORKFLOW_BACKUP',
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
        },
        {
          id: 'pci-ai-training',
          translation: 'sidebar_pci_ai_training',
          serviceType: 'CLOUD_PROJECT_AI_JOB',
        },
        {
          id: 'pci-ai-app',
          translation: 'sidebar_pci_ai_app',
          serviceType: 'CLOUD_PROJECT_AI_APP',
        },
        {
          id: 'pci-ml-serving',
          translation: 'sidebar_pci_ml_serving',
          serviceType: 'CLOUD_PROJECT_AI_SERVING',
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
        },
        {
          id: 'pci-data-processing',
          translation: 'sidebar_pci_data_processing',
          serviceType: 'CLOUD_PROJECT_DATAPROCESSING_JOBS',
        },
        {
          id: 'pci-logs-data-platform',
          translation: 'sidebar_pci_logs_data_platform',
          serviceType: 'DBAAS_LOGS',
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
        },
        {
          id: 'pci-quota-region',
          translation: 'sidebar_pci_quota_regions',
        },
        {
          id: 'pci-ssh-keys',
          translation: 'sidebar_pci_ssh_keys',
          serviceType: 'CLOUD_PROJECT_SSHKEY',
        },
        {
          id: 'pci-billing',
          translation: 'sidebar_pci_billing',
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
