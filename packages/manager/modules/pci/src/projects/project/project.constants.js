export const ACTIONS = [
  {
    translation: 'pci_projects_project_create_an_instance',
    state: 'pci.projects.project.instances.new',
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
  },
];

export const LINKS = [
  {
    translation: 'pci_projects_project_documentation_getting_started_with_public_cloud_logging_in_and_creating_a_project',
    href: '#',
  },
  {
    translation: 'pci_projects_project_documentation_create_user_access_to_horizon',
    href: '#',
  },
  {
    translation: 'pci_projects_project_documentation_boot_your_first_cloud_server_in_3_minutes',
    href: '#',
  },
  {
    translation: 'pci_projects_project_documentation_prepare_the_environment_for_using_the_open_stack_api',
    href: '#',
  },
  {
    translation: 'pci_projects_project_documentation_create_and_configure_and_additional_disk_on_an_instance',
    href: '#',
  },
  {
    translation: 'pci_projects_project_documentation_see_all_public_cloud_guides',
    href: '#',
  },
];

export default {
  ACTIONS,
  LINKS,
};
