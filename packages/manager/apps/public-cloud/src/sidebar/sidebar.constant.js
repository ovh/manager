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
          state: 'pci.projects.project2',
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
          state: 'pci.projects.project2',
        },
        translation: 'cloud_sidebar_private_network',
      },
      {
        options: {
          state: 'pci.projects.project2',
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
    translation: 'cloud_sidebar_orchestration',
  },
  {
    translation: 'cloud_sidebar_management_interface',
    subitems: [
      {
        options: {
          state: 'pci.projects.project2',
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
          state: 'pci.projects.project.legacy.compute.openstack.users',
        },
        translation: 'cloud_sidebar_project_management_users',
      },
      {
        options: {
          state: 'pci.projects.project.legacy.compute.quota',
        },
        translation: 'cloud_sidebar_project_management_quota_region',
      },
      {
        options: {
          state: 'pci.projects.project.legacy.compute.ssh',
        },
        translation: 'cloud_sidebar_project_management_ssh_keys',
      },
      {
        options: {
          state: 'pci.projects.project.legacy.billing.consumption.current',
        },
        translation: 'cloud_sidebar_project_management_billing_control',
      },
      {
        options: {
          state: 'pci.projects.project.legacy.billing.vouchers',
        },
        translation: 'cloud_sidebar_project_management_credit_vouchers',
      },
      {
        options: {
          state: 'pci.projects.project.legacy.billing.rights',
        },
        translation: 'cloud_sidebar_project_management_contact_rights',
      },
    ],
    translation: 'cloud_sidebar_project_management',
  },
];

export default { MENU };
