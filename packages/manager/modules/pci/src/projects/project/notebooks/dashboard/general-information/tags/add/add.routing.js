export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.notebooks.dashboard.general-information.tags-add',
    {
      url: '/add-tag',
      views: {
        modal: {
          component: 'pciNotebooksNotebookDashboardTagsAdd',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
      },
    },
  );
};
