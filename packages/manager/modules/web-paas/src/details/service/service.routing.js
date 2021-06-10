export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.dashboard.service', {
    url: '/service',
    views: {
      projectView: 'webPaasDetailsService',
    },
    resolve: {
      webPaasDashboardPrefix: () => 'web-paas::project-dashboard::',
      goToAddAddon: /* @ngInject */ ($state, projectId, atInternet) => (
        addonType,
        trackText,
      ) => {
        atInternet.trackClick({
          name: trackText,
          type: 'action',
        });
        return $state.go('web-paas.dashboard.service.add-addon', {
          projectId,
          addonType,
        });
      },
      goToChangeOffer: /* @ngInject */ ($state, projectId, atInternet) => (
        trackText,
        cpu,
      ) => {
        atInternet.trackClick({ name: trackText, type: 'action' });
        return $state.go('web-paas.dashboard.service.change-offer', {
          projectId,
          cpu,
        });
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('web_paas_general_info'),
    },
    atInternet: {
      rename: 'web::web-paas-platform-sh::project-dashboard',
    },
  });
};
