export default /* @ngInject */ ($stateProvider) => {
  const stateName = 'pci.projects.project.ai.apps.dashboard.attach-data';
  $stateProvider.state(stateName, {
    url: '/attach-data',
    views: {
      appView: 'ovhManagerPciProjectAppAttachData',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_apps_tab_attach_data_title'),

      goBack: /* @ngInject */ (app, goToApp) => (message, type) =>
        goToApp(app, message, type),
    },
  });
};
