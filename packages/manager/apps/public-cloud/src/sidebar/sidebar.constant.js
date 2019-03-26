export const MENU = [
  {
    subitems: [
      {
        options: {
          state: 'cloud',
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
          state: 'cloud',
        },
        translation: 'cloud_sidebar_storage_block_storage',
      },
      {
        options: {
          state: 'cloud',
        },
        translation: 'cloud_sidebar_storage_object_storage',
      },
      {
        options: {
          state: 'cloud',
        },
        translation: 'cloud_sidebar_storage_cold_storage',
      },
      {
        options: {
          state: 'cloud',
        },
        translation: 'cloud_sidebar_storage_volume_storage',
      },
      {
        options: {
          state: 'cloud',
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
          state: 'cloud',
        },
        translation: 'cloud_sidebar_private_network',
      },
    ],
    translation: 'cloud_sidebar_network',
  },
  {
    subitems: [
      {
        options: {
          state: 'cloud',
        },
        translation: 'cloud_sidebar_orchestration_kubernetes',
      },
    ],
    translation: 'cloud_sidebar_orchestration',
  },
  {
    translation: 'cloud_sidebar_data_analytics',
  },
  {
    translation: 'cloud_sidebar_management_interface',
  },
  {
    translation: 'cloud_sidebar_marketplace',
  },
  {
    options: {
      icon: 'oui-icon oui-icon-gear_line',
      allowSubItems: true,
    },
    subitems: [
      {
        options: {
          state: 'cloud',
        },
        translation: 'cloud_sidebar_project_management_users',
      },
      {
        options: {
          state: 'cloud',
        },
        translation: 'cloud_sidebar_project_management_quota_region',
      },
      {
        options: {
          state: 'cloud',
        },
        translation: 'cloud_sidebar_project_management_ssh_keys',
      },
      {
        options: {
          state: 'cloud',
        },
        translation: 'cloud_sidebar_project_management_billing_control',
      },
      {
        options: {
          state: 'cloud',
        },
        translation: 'cloud_sidebar_project_management_credit_vouchers',
      },
      {
        options: {
          state: 'cloud',
        },
        translation: 'cloud_sidebar_project_management_contact_rights',
      },
    ],
    translation: 'cloud_sidebar_project_management',
  },
];

export default { MENU };
