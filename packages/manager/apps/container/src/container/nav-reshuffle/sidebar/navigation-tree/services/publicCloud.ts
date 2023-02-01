import { Node, NodeTag } from '../node';

const pciNode: Node = {
  id: 'pci',
  translation: 'sidebar_pci',
  routing: {
    application: 'public-cloud',
    hash: '#/pci/projects/{projectId}',
  },
  features: ['public-cloud'],
  forceVisibility: true,
  children: [
    {
      id: 'pci-compute',
      translation: 'sidebar_pci_compute',
      features: ['instance'],
      forceVisibility: true,
      children: [
        {
          id: 'pci-instances',
          translation: 'sidebar_pci_instances',
          serviceType: 'CLOUD_PROJECT_INSTANCE',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/instances',
          },
          features: ['instance'],
          forceVisibility: true,
        },
      ],
    },
    {
      id: 'pci-storage',
      translation: 'sidebar_pci_storage',
      features: [
        'block-storage',
        'object-storage',
        'snapshot',
        'instance-backup',
        'archive',
        'cold-archive',
      ],
      forceVisibility: true,
      children: [
        {
          id: 'pci-block-storage',
          translation: 'sidebar_pci_block_storage',
          serviceType: 'CLOUD_PROJECT_VOLUME',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/storages/blocks',
          },
          features: ['block-storage'],
          forceVisibility: true,
        },
        {
          id: 'pci-object-storage',
          translation: 'sidebar_pci_object_storage',
          serviceType: 'CLOUD_PROJECT_STORAGE_OBJECTS',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/storages/objects',
          },
          features: ['object-storage'],
          forceVisibility: true,
        },
        {
          id: 'pci-cloud-archive',
          translation: 'sidebar_pci_cloud_archive',
          serviceType: 'CLOUD_PROJECT_STORAGE_ARCHIVES',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/storages/cloud-archives',
          },
          features: ['archive'],
          forceVisibility: true,
        },
        {
          id: 'pci-cold-archive',
          translation: 'sidebar_pci_cold_archive',
          serviceType: 'CLOUD_PROJECT_STORAGE_COLD_ARCHIVES',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/storages/cold-archive',
          },
          features: ['cold-archive'],
          forceVisibility: true,
          tag: NodeTag.BETA,
        },
        {
          id: 'pci-databases',
          translation: 'sidebar_pci_databases',
          serviceType: 'CLOUD_PROJECT_DATABASE',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/storages/databases',
          },
          features: ['databases'],
          forceVisibility: true,
          tag: NodeTag.NEW,
        },
        {
          id: 'pci-volume-snapshot',
          translation: 'sidebar_pci_volume_snapshot',
          serviceType: 'CLOUD_PROJECT_VOLUME_SNAPSHOT',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/storages/volume-snapshots',
          },
          features: ['snapshot'],
          forceVisibility: true,
        },
        {
          id: 'pci-instance-backup',
          translation: 'sidebar_pci_instance_backup',
          serviceType: 'CLOUD_PROJECT_SNAPSHOT',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/storages/instance-backups',
          },
          features: ['instance-backup'],
          forceVisibility: true,
        },
      ],
    },
    {
      id: 'pci-network',
      translation: 'sidebar_pci_network',
      features: [
        'private-network',
        'failover-ip',
        'additional-ips',
        'public-gateways',
      ],
      forceVisibility: true,
      children: [
        {
          id: 'pci-private-network',
          translation: 'sidebar_pci_private_network',
          serviceType: 'CLOUD_PROJECT_PRIVATE_NETWORK',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/private-networks',
          },
          features: ['private-network'],
          forceVisibility: true,
        },
        {
          id: 'pci-failover-ip',
          translation: 'sidebar_pci_failover_ip',
          serviceType: 'CLOUD_PROJECT_IP_FAILOVER',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/failover-ips',
          },
          features: ['failover-ip'],
          forceVisibility: true,
        },
        {
          id: 'pci-additional-ips',
          translation: 'sidebar_pci_additional_ips',
          serviceType: 'CLOUD_PROJECT_ADDITIONAL_IP',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/public-ips',
          },
          features: ['additional-ips'],
          forceVisibility: true,
        },
        {
          id: 'pci-public-gateways',
          translation: 'sidebar_pci_public_gateways',
          serviceType: 'CLOUD_PROJECT_PUBLIC_GATEWAYS',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/gateway',
          },
          features: ['public-gateways'],
          forceVisibility: true,
        },
      ],
    },
    {
      id: 'pci-containers',
      translation: 'sidebar_pci_containers',
      features: [
        'kubernetes',
        'load-balancer',
        'private-registry',
        'workflow-management',
      ],
      forceVisibility: true,
      children: [
        {
          id: 'pci-kubernetes',
          translation: 'sidebar_pci_kubernetes',
          serviceType: 'CLOUD_PROJECT_KUBE',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/kubernetes',
          },
          features: ['kubernetes'],
          forceVisibility: true,
        },
        {
          id: 'pci-kubernetes-load-balancer',
          translation: 'sidebar_pci_kubernetes_load_balancer',
          serviceType: 'CLOUD_PROJECT_LOADBALANCER',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/load-balancer',
          },
          features: ['load-balancer'],
          forceVisibility: true,
        },
        {
          id: 'pci-private-registry',
          translation: 'sidebar_pci_private_registry',
          serviceType: 'CLOUD_PROJECT_CONTAINER_REGISTRY',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/private-registry',
          },
          features: ['private-registry'],
          forceVisibility: true,
        },
        {
          id: 'pci-workflow',
          translation: 'sidebar_pci_workflow',
          serviceType: 'CLOUD_PROJECT_WORKFLOW_BACKUP',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/workflow',
          },
          features: ['workflow-management'],
          forceVisibility: true,
        },
      ],
    },
    {
      id: 'pci-ai',
      translation: 'sidebar_pci_ai',
      features: ['notebooks', 'ai-apps', 'training'],
      forceVisibility: true,
      children: [
        {
          id: 'pci-ai-notebooks',
          translation: 'sidebar_pci_ai_notebooks',
          serviceType: 'CLOUD_PROJECT_AI_NOTEBOOK',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/notebooks',
          },
          features: ['notebooks'],
          forceVisibility: true,
        },
        {
          id: 'pci-ai-training',
          translation: 'sidebar_pci_ai_training',
          serviceType: 'CLOUD_PROJECT_AI_JOB',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/training',
          },
          features: ['training'],
          forceVisibility: true,
        },
        {
          id: 'pci-ai-app',
          translation: 'sidebar_pci_ai_app',
          serviceType: 'CLOUD_PROJECT_AI_APP',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/ai',
          },
          features: ['ai-apps'],
          forceVisibility: true,
          tag: NodeTag.ALPHA,
        },
      ],
    },
    {
      id: 'pci-analytics',
      translation: 'sidebar_pci_analytics',
      features: ['data-processing', 'logs-data-platform'],
      forceVisibility: true,
      children: [
        {
          id: 'pci-data-processing',
          translation: 'sidebar_pci_data_processing',
          serviceType: 'CLOUD_PROJECT_DATAPROCESSING_JOBS',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/data-processing',
          },
          features: ['data-processing'],
          forceVisibility: true,
          tag: NodeTag.NEW,
        },
        {
          id: 'pci-logs-data-platform',
          translation: 'sidebar_pci_logs_data_platform',
          serviceType: 'DBAAS_LOGS',
          routing: {
            application: 'dedicated',
            hash: '#/dbaas/logs',
          },
          features: ['logs-data-platform'],
          forceVisibility: true,
        },
      ],
    },
    {
      id: 'pci-management-interface',
      translation: 'sidebar_pci_management',
      features: ['horizon'],
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
          features: ['horizon'],
        },
      ],
    },
    {
      id: 'pci-settings',
      translation: 'sidebar_pci_settings',
      count: false,
      features: [
        'public-cloud:users',
        'public-cloud:quota',
        'public-cloud:ssh-keys',
        'public-cloud:billing',
        'public-cloud:vouchers',
        'public-cloud:contacts',
        'public-cloud:project-settings',
      ],
      children: [
        {
          id: 'pci-users-roles',
          translation: 'sidebar_pci_users_roles',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/users',
          },
          count: false,
          features: ['public-cloud:users'],
        },
        {
          id: 'pci-quota-region',
          translation: 'sidebar_pci_quota_regions',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/quota',
          },
          count: false,
          features: ['public-cloud:quota'],
        },
        {
          id: 'pci-ssh-keys',
          translation: 'sidebar_pci_ssh_keys',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/ssh',
          },
          count: false,
          features: ['public-cloud:ssh-keys'],
        },
        {
          id: 'pci-billing',
          translation: 'sidebar_pci_billing',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/billing',
          },
          count: false,
          features: ['public-cloud:billing'],
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
          features: ['public-cloud:vouchers'],
        },
        {
          id: 'pci-contacts-rights',
          translation: 'sidebar_pci_contacts_rights',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/contacts',
          },
          count: false,
          features: ['public-cloud:contacts'],
        },
        {
          id: 'pci-project-settings',
          translation: 'sidebar_pci_project_settings',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/edit',
          },
          count: false,
          features: ['public-cloud:project-settings'],
        },
      ],
    },
  ],
};

export default pciNode;
