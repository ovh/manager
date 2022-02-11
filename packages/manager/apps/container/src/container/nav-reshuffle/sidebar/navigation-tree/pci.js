export default {
  children: [
    {
      id: 'pci-compute',
      translation: 'sidebar_pci_compute',
      children: [
        {
          id: 'pci-instances',
          translation: 'sidebar_pci_instances',
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
        },
        {
          id: 'pci-databases',
          translation: 'sidebar_pci_databases',
        },
        {
          id: 'pci-cloud-archive',
          translation: 'sidebar_pci_cloud_archive',
        },
        {
          id: 'pci-volume-snapshot',
          translation: 'sidebar_pci_volume_snapshot',
        },
        {
          id: 'pci-instance-backup',
          translation: 'sidebar_pci_instance_backup',
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
        },
        {
          id: 'pci-private-network',
          translation: 'sidebar_pci_private_network',
        },
        {
          id: 'pci-failover-ip',
          translation: 'sidebar_pci_failover_ip',
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
        },
        {
          id: 'pci-private-registry',
          translation: 'sidebar_pci_private_registry',
        },
        {
          id: 'pci-workflow',
          translation: 'sidebar_pci_workflow',
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
        },
        {
          id: 'pci-ai-training',
          translation: 'sidebar_pci_ai_training',
        },
        {
          id: 'pci-ai-app',
          translation: 'sidebar_pci_ai_app',
        },
        {
          id: 'pci-ml-serving',
          translation: 'sidebar_pci_ml_serving',
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
        },
        {
          id: 'pci-data-processing',
          translation: 'sidebar_pci_data_processing',
        },
        {
          id: 'pci-logs-data-platform',
          translation: 'sidebar_pci_logs_data_platform',
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
        },
        {
          id: 'pci-quota-region',
          translation: 'sidebar_pci_quota_regions',
        },
        {
          id: 'pci-ssh-keys',
          translation: 'sidebar_pci_ssh_keys',
        },
        {
          id: 'pci-billing',
          translation: 'sidebar_pci_billing',
        },
        {
          id: 'pci-credits-vouchers',
          translation: 'sidebar_pci_credits_vouchers',
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
