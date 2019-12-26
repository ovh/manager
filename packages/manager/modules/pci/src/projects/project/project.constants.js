export const ACTIONS = [
  {
    translation: 'pci_projects_project_create_an_instance',
    state: 'pci.projects.project.instances.add',
  },
  {
    translation: 'pci_projects_project_create_a_volume',
    state: 'pci.projects.project.storages.blocks.add',
  },
  {
    translation: 'pci_projects_project_create_a_container',
    state: 'pci.projects.project.storages.objects.add',
  },
  {
    translation: 'pci_projects_project_activate_private_networks',
    state: 'pci.projects.project.privateNetwork',
  },
  {
    translation: 'pci_projects_project_create_cluster_kubernetes',
    state: 'pci.projects.project.kubernetes',
    regions: ['CA', 'EU'],
  },
];

export const LINKS = [
  {
    translation:
      'pci_projects_project_documentation_create_user_access_to_horizon',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/configure_user_access_to_horizon/',
  },
  {
    translation:
      'pci_projects_project_documentation_boot_your_first_cloud_server_in_3_minutes',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/create_an_instance_in_your_ovh_customer_account',
  },
  {
    translation:
      'pci_projects_project_documentation_prepare_the_environment_for_using_the_open_stack_api',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/prepare_the_environment_for_using_the_openstack_api/',
  },
  {
    translation:
      'pci_projects_project_documentation_create_and_configure_and_additional_disk_on_an_instance',
    href:
      'https://docs.ovh.com/gb/en/public-cloud/create-an-additional-volume-and-attach-it-to-an-instance/',
  },
  {
    translation:
      'pci_projects_project_documentation_see_all_public_cloud_guides',
    href: 'https://docs.ovh.com/gb/en/public-cloud',
  },
];

export default {
  ACTIONS,
  LINKS,
};
