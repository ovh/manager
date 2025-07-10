export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.force-outperform-2020', {
    url: '/force_outperform',
    views: {
      modal: {
        component: 'vpsForceOutperform2020Component',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ ($state, CucCloudMessage, serviceName) => (
        message = false,
        type = 'success',
      ) => {
        const state = 'vps.detail.dashboard';
        const promise = $state.go(
          state,
          { serviceName },
          {
            reload: message && type === 'success',
          },
        );
        if (message) {
          promise.then(() => {
            CucCloudMessage[type]({ textHtml: message }, state);
          });
        }
        return promise;
      },
      breadcrumb: () => null,
    },
  });
};
