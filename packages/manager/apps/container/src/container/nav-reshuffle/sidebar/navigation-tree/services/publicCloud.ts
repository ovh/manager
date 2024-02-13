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
        'volume-backup',
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
          id: 'pci-volume-backup',
          translation: 'sidebar_pci_volume_backup',
          serviceType: 'CLOUD_PROJECT_VOLUME_BACKUP',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/storages/volume-backup',
          },
          features: ['volume-backup'],
          forceVisibility: true,
          tag: NodeTag.NEW,
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
      id: 'pci-network',
      translation: 'sidebar_pci_network',
      features: [
        'private-network',
        'octavia-load-balancer',
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
          id: 'pci-octavia-load-balancer',
          translation: 'sidebar_pci_octavia_load_balancer',
          serviceType: 'CLOUD_PROJECT_OCTAVIA_LOAD_BALANCER',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/octavia-load-balancer',
          },
          features: ['octavia-load-balancer'],
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
        'pci-rancher',
        'kubernetes',
        'load-balancer',
        'private-registry',
        'workflow-management',
      ],
      forceVisibility: true,
      children: [
        {
          id: 'pci-rancher',
          translation: 'sidebar_pci_rancher',
          serviceType: 'CLOUD_PROJECT_KUBE',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/rancher',
          },
          features: ['pci-rancher'],
          forceVisibility: true,
        },
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
          region: ['EU', 'CA'],
          features: ['load-balancer'],
          forceVisibility: true,
        },
        {
          id: 'pci-kubernetes-load-balancer',
          translation: 'sidebar_pci_load_balancer',
          serviceType: 'CLOUD_PROJECT_LOADBALANCER',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/load-balancer',
          },
          region: ['US'],
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
      ],
    },
    {
      id: 'pci-analytics',
      translation: 'sidebar_pci_analytics',
      features: ['data-processing', 'logs-data-platform', 'databases'],
      forceVisibility: true,
      children: [
        {
          id: 'pci-analytics-databases',
          translation: 'sidebar_pci_analytics_databases',
          serviceType: 'CLOUD_PROJECT_DATABASE',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/storages/databases-analytics/databases',
          },
          features: ['databases'],
          forceVisibility: true,
        },
        {
          id: 'pci-analytics-data-streaming',
          translation: 'sidebar_pci_analytics_data_streaming',
          serviceType: 'CLOUD_PROJECT_DATABASE',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/storages/databases-analytics/data-streaming',
          },
          features: ['databases'],
          forceVisibility: true,
        },
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
          id: 'pci-analytics-data-analysis',
          translation: 'sidebar_pci_analytics_data_analysis',
          serviceType: 'CLOUD_PROJECT_DATABASE',
          routing: {
            application: 'public-cloud',
            hash: '#/pci/projects/{projectId}/storages/databases-analytics/data-analysis',
          },
          features: ['databases'],
          forceVisibility: true,
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
            CA: 'https://auth.cloud.ovh.net/v3/auth/OS-FEDERATION/identity_providers/ovhcloud-world/protocols/openid/websso?origin=https://horizon.cloud.ovh.net/auth/websso/',
            EU: 'https://auth.cloud.ovh.net/v3/auth/OS-FEDERATION/identity_providers/ovhcloud-emea/protocols/openid/websso?origin=https://horizon.cloud.ovh.net/auth/websso/',
            US: 'https://auth.cloud.ovh.us/v3/auth/OS-FEDERATION/identity_providers/ovhcloud-us/protocols/openid/websso?origin=https://horizon.cloud.ovh.us/auth/websso/',
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
