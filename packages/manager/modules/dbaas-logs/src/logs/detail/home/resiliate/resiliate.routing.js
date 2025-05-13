export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.detail.home.resiliate', {
    url: '/resiliate',
    views: {
      modal: {
        component: 'billingAutorenewTerminateAgoraService',
      },
    },
    layout: 'modal',
    resolve: {
      id: /* @ngInject */ (serviceInfos) => serviceInfos.serviceId,
      serviceType: /* @ngInject */ (LogsConstants) =>
        LogsConstants.SERVICE_TYPE,
      goBack: /* @ngInject */ ($state, $timeout, Alerter) => (
        message,
        type,
      ) => {
        const promise = $state.go('dbaas-logs.detail.home', {});

        if (message) {
          promise.then(() =>
            $timeout(() =>
              Alerter.set(`alert-${type}`, message, null, 'logs-home-alert'),
            ),
          );
        }
      },
    },
  });
};
