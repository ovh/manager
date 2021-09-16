export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.quantum-computing.dashboard.general-information.tags-add',
    {
      url: '/add-tag',
      views: {
        modal: {
          component: 'pciQuantumComputingNotebookDashboardTagsAdd',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
