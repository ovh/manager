export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.associate-ip-bloc', {
    url: '/associate-ip-bloc',
    params: {
      ips: null,
    },
    views: {
      modal: {
        component: 'ovhManagerDedicatedMoveIp',
      },
    },
    layout: 'modal',
    resolve: {
      ips: /* @ngInject */ ($transition$) => $transition$.params().ips,
      goBack: /* @ngInject */ ($state, $timeout, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'app.ip',
          {},
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            $timeout(() => Alerter.set(`alert-${type}`, message, null)),
          );
        }

        return promise;
      },
      trackingPrefix: () => 'dedicated::ip::associate-ip-bloc',
    },
  });
};
