export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.secondary-dns.add', {
    url: '/add',
    views: {
      modal: {
        component: 'serverSecondaryDnsAdd',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ ($state, $timeout, Alerter) => (
        message = false,
        type = 'success',
        reload = false,
      ) => {
        const promise = $state.go(
          'app.dedicated-server.server.secondary-dns',
          {},
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            $timeout(() =>
              Alerter.set(
                `alert-${type}`,
                message,
                null,
                'server_dashboard_alert',
              ),
            ),
          );
        }

        return promise;
      },
      breadcrumb: /* @ngInject */ () => null,
    },
  });
};
