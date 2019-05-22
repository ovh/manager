export const HORIZON = {
  CA: 'https://horizon.cloud.ovh.net/auth/login/',
  EU: 'https://horizon.cloud.ovh.net/auth/login/',
  US: 'https://horizon.cloud.ovh.us/auth/login/',
};

export const MENU = [
  {
    subitems: [
      {
        id: 'instance',
        options: {
          state: 'pci.projects.project.instances',
        },
        translation: 'cloud_sidebar_compute_instance',
      },
    ],
    translation: 'cloud_sidebar_compute',
  },
  {
    subitems: [
      {
        id: 'block-storage',
        options: {
          state: 'pci.projects.project.storages.blocks',
        },
        translation: 'cloud_sidebar_storage_block_storage',
      },
      {
        id: 'object-storage',
        options: {
          state: 'pci.projects.project.storages.objects',
        },
        translation: 'cloud_sidebar_storage_object_storage',
      },
      {
        id: 'archive',
        options: {
          state: 'pci.projects.project.storages.archives',
        },
        translation: 'cloud_sidebar_storage_cold_storage',
      },
      {
        id: 'snapshot',
        options: {
          state: 'pci.projects.project.storages.snapshots',
        },
        translation: 'cloud_sidebar_storage_volume_storage',
      },
      {
        id: 'instance-backup',
        options: {
          state: 'pci.projects.project.storages.instance-backups',
        },
        translation: 'cloud_sidebar_storage_instance_storage',
      },
    ],
    translation: 'cloud_sidebar_storage',
  },
  {
    subitems: [
      {
        id: 'private-network',
        options: {
          state: 'pci.projects.project.privateNetwork',
        },
        translation: 'cloud_sidebar_private_network',
      },
      {
        id: 'failover-ip',
        options: {
          state: 'pci.projects.project.failover-ips',
        },
        translation: 'cloud_sidebar_failover_ip',
      },
    ],
    translation: 'cloud_sidebar_network',
  },
  {
    subitems: [
      {
        id: 'kubernetes',
        options: {
          state: 'pci.projects.project.kubernetes',
        },
        translation: 'cloud_sidebar_orchestration_kubernetes',
      },
      {
        id: 'private-registry',
        options: {
          state: 'pci.projects.project.private-registry',
        },
        translation: 'cloud_sidebar_orchestration_private_registry',
      },
    ],
    regions: ['CA', 'EU'],
    translation: 'cloud_sidebar_orchestration',
  },
  {
    translation: 'cloud_sidebar_management_interface',
    subitems: [
      {
        id: 'horizon',
        options: {
          url: HORIZON,
          target: '_blank',
        },
        translation: 'cloud_sidebar_management_interface_horizon',
      },
    ],
  },
  {
    options: {
      icon: 'oui-icon oui-icon-gear_line',
      allowSubItems: true,
    },
    subitems: [
      {
        id: 'users',
        options: {
          state: 'pci.projects.project.users',
        },
        translation: 'cloud_sidebar_project_management_users',
      },
      {
        id: 'quota',
        options: {
          state: 'pci.projects.project.quota',
        },
        translation: 'cloud_sidebar_project_management_quota_location',
      },
      {
        id: 'ssh-keys',
        options: {
          state: 'pci.projects.project.sshKeys',
        },
        translation: 'cloud_sidebar_project_management_ssh_keys',
      },
      {
        id: 'billing',
        options: {
          state: 'pci.projects.project.billing',
        },
        regions: ['EU', 'CA'],
        translation: 'cloud_sidebar_project_management_billing_control',
      },
      {
        id: 'vouchers',
        options: {
          state: 'pci.projects.project.vouchers',
        },
        regions: ['EU', 'CA'],
        translation: 'cloud_sidebar_project_management_credit_vouchers',
      },
      {
        id: 'contacts',
        options: {
          state: 'pci.projects.project.contacts',
        },
        regions: ['EU', 'CA'],
        translation: 'cloud_sidebar_project_management_contact_rights',
      },
      {
        id: 'management-settings',
        options: {
          state: 'pci.projects.project.edit',
        },
        translation: 'cloud_sidebar_project_management_settings',
      },
    ],
    translation: 'cloud_sidebar_project_management',
  },
];

export default {
  HORIZON,
  MENU,
};
