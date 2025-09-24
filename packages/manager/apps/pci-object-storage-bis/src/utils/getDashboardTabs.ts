type TTab = {
  name: string;
  title: string;
  to: string;
};

type TStorageTabsProps = {
  projectId: string;
  storageId: string;
  region: string;
  t: (key: string) => string;
};

export const getDashboardTabs = ({
  projectId,
  storageId,
  region,
  t,
}: TStorageTabsProps): TTab[] => {
  return [
    {
      name:
        'pci_projects_project_storages_dashboard_container_general_informations',
      title: t(
        'dashboard:pci_projects_project_storages_dashboard_container_general_informations',
      ),
      to: `/pci/projects/${projectId}/storages/objects/dashboard/${storageId}?region=${region}`,
    },
    {
      name: 'pci_projects_project_storages_dashboard_container_objects',
      title: t(
        'dashboard:pci_projects_project_storages_dashboard_container_objects',
      ),
      to: `/pci/projects/${projectId}/storages/objects/${storageId}?region=${region}`,
    },
  ];
};
