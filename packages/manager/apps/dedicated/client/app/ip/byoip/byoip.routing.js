import ipByoipComponent from './byoip.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.byoip', {
    url: '/byoip',
    views: {
      byoip: ipByoipComponent.name,
    },
    resolve: {
      plan: /* @ngInject */ (ByoipService) => ByoipService.getCatalog(),
      getToken: /* @ngInject */ (ByoipService) => (region) =>
        ByoipService.getToken(region),
      goToDisclaimer: /* @ngInject */ ($state) => (expressOrderUrl) =>
        $state.go('app.ip.byoip.disclaimer', { expressOrderUrl }),
      goToByoipConfiguration: /* @ngInject */ ($state, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go('app.ip.byoip', {
          reload,
        });

        if (message) {
          Alerter.alertFromSWS(message, type, 'ip_byoip_configuration');
        }

        return promise;
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('ip_byoip'),
    },
  });
};
