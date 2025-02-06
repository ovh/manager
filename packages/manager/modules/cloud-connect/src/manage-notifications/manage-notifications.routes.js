export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.index.managenotifications', {
    url: '?uuid',
    params: {
      uuid: null,
      description: null,
    },
    views: {
      modal: {
        component: 'ovhCloudConnectManageNotifications',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ ($state, $timeout, Alerter) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';
        const promise = $state.go(
          'cloud-connect.index',
          {},
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            $timeout(() =>
              type === 'success'
                ? Alerter.success(message, 'cloud_connect_alert')
                : Alerter.error(message, 'cloud_connect_alert'),
            ),
          );
        }
        return promise;
      },
      uuid: /* @ngInject */ ($transition$) => $transition$.params().uuid,
      description: /* @ngInject */ ($transition$) =>
        $transition$.params().description,
      breadcrumb: () => null,
    },
    atInternet: {
      ignore: true,
    },
  });
};
