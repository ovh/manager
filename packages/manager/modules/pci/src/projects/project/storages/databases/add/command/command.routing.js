export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.databases.add.command', {
    url: '/command',
    views: {
      modal: {
        component: 'ovhManagerPciProjectDatabasesAddCommand',
      },
    },
    params: {
      data: null,
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      data: /* @ngInject */ ($transition$) => $transition$.params().data,
      goBack: /* @ngInject */ ($state, projectId) => (reload = false) =>
        $state.go(
          'pci.projects.project.storages.databases.add',
          {
            projectId,
          },
          {
            reload,
          },
        ),
    },
    atInternet: {
      ignore: true,
    },
  });
};
