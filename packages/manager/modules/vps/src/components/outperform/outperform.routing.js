export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.outperform', {
    url: '/outperform?vpsName',
    views: {
      vpsContainer: 'vpsOutperformComponent',
    },
    resolve: {
      vpsName: /* @ngInject */ ($transition$) => $transition$.params().vpsName,
      goBack: /* @ngInject */ ($state, CucCloudMessage, vpsName) => (
        message = false,
        type = 'success',
        reload = false,
        vpsNameSelected = null,
      ) => {
        const serviceName = vpsName || vpsNameSelected;
        const state = serviceName ? 'vps.detail.dashboard' : 'vps.index';
        const promise = $state.go(state, serviceName ? { serviceName } : {}, {
          reload: (message && type === 'success') || reload,
        });
        if (message) {
          promise.then(() => {
            CucCloudMessage[type]({ textHtml: message }, state);
          });
        }
        return promise;
      },

      breadcrumb: ($translate) => $translate.instant('vps_outperform_title'),
    },
  });
};
