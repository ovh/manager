export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('pci.projects.project.streams.add', {
    url: '/new',
    component: 'ovhManagerPciInstancesAdd',
    resolve: {
      breadcrumb: /* @ngInject */ $translate => $translate.instant('pci_projects_project_streams_add_title'),

      cancelLink: /* @ngInject */ ($state, projectId) => $state.href('pci.projects.project.streams', {
        projectId,
      }),

      goBack: /* @ngInject */ goToStreams => goToStreams,

    },
  });
};
