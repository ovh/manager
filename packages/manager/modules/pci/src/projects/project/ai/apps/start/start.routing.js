export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.ai.apps.start', {
    url: '/start',
    params: { app: null },
    views: {
      modal: {
        component: 'ovhManagerPciProjectAppsStartApp',
      },
    },
    layout: 'modal',
    resolve: {
      app: /* @ngInject */ ($transition$) => $transition$.params().app,
      goBack: /* @ngInject */ (goToApps) => goToApps,
      breadcrumb: () => null,
      trackingPrefix: () => 'table::options_menu',
    },
  });
};
