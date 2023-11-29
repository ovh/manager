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

      goBackToAttachData: /* @ngInject */ ($state, CucCloudMessage) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const state = 'pci.projects.project.ai.apps.dashboard.attach-data';
        const promise = $state.go(state, {}, { reload });
        if (message) {
          promise.then(() => {
            CucCloudMessage[type](message, state);
          });
        }
        return promise;
      },

      goToManualDataSync: /* @ngInject */ ($state, projectId) => (
        appId,
        volumeId,
        directory,
      ) =>
        $state.go(
          'pci.projects.project.ai.apps.dashboard.attach-data.data-sync',
          {
            projectId,
            appId,
            volumeId,
            directory,
          },
        ),
    },
  });
};
