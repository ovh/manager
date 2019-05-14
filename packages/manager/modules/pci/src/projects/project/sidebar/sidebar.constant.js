export const MENU = [
  {
    subitems: [
      {
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
        options: {
          state: 'pci.projects.project.storages.blocks',
        },
        translation: 'cloud_sidebar_storage_block_storage',
      },
      {
        options: {
          state: 'pci.projects.project.storages.objects',
        },
        translation: 'cloud_sidebar_storage_object_storage',
      },
      {
        options: {
          state: 'pci.projects.project.storages.archives',
        },
        translation: 'cloud_sidebar_storage_cold_storage',
      },
      {
        options: {
          state: 'pci.projects.project.storages.snapshots',
        },
        translation: 'cloud_sidebar_storage_volume_storage',
      },
      {
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
        options: {
          state: 'pci.projects.project.privateNetwork',
        },
        translation: 'cloud_sidebar_private_network',
      },
      {
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
        options: {
          state: 'pci.projects.project.kubernetes',
        },
        translation: 'cloud_sidebar_orchestration_kubernetes',
      },
    ],
    regions: ['EU', 'CA'],
    translation: 'cloud_sidebar_orchestration',
  },
  {
    translation: 'cloud_sidebar_management_interface',
    subitems: [
      {
        options: {
          url: 'https://horizon.cloud.ovh.net/auth/login',
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
        options: {
          state: 'pci.projects.project.users',
        },
        translation: 'cloud_sidebar_project_management_users',
      },
      {
        options: {
          state: 'pci.projects.project.quota',
        },
        translation: 'cloud_sidebar_project_management_quota_location',
      },
      {
        options: {
          state: 'pci.projects.project.sshKeys',
        },
        translation: 'cloud_sidebar_project_management_ssh_keys',
      },
      {
        options: {
          state: 'pci.projects.project.billing',
        },
        regions: ['EU', 'CA'],
        translation: 'cloud_sidebar_project_management_billing_control',
      },
      {
        options: {
          state: 'pci.projects.project.vouchers',
        },
        regions: ['EU', 'CA'],
        translation: 'cloud_sidebar_project_management_credit_vouchers',
      },
      {
        options: {
          state: 'pci.projects.project.contacts',
        },
        regions: ['EU', 'CA'],
        translation: 'cloud_sidebar_project_management_contact_rights',
      },
      {
        options: {
          state: 'pci.projects.project.edit',
        },
        translation: 'cloud_sidebar_project_management_settings',
      },
    ],
    translation: 'cloud_sidebar_project_management',
  },
];

export default { MENU };
