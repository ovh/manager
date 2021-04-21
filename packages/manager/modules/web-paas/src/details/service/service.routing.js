export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.dashboard.service', {
    url: '/service',
    views: {
      projectView: 'webPaasDetailsService',
    },
    resolve: {
      goToAddAddon: /* @ngInject */ ($state, projectId) => (addonType) =>
        $state.go('web-paas.dashboard.service.add-addon', {
          projectId,
          addonType,
        }),
      goToChangeOffer: /* @ngInject */ ($state, projectId) => (cpu) =>
        $state.go('web-paas.dashboard.service.change-offer', {
          projectId,
          cpu,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('web_paas_general_info'),
    },
  });
};
