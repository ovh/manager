export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dbaas-logs.list.resiliate', {
    url: '/resiliate',
    views: {
      modal: {
        component: 'billingAutorenewTerminateAgoraService',
      },
    },
    params: {
      serviceName: null,
    },
    layout: 'modal',
    resolve: {
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      serviceType: /* @ngInject */ (LogsConstants) =>
        LogsConstants.SERVICE_TYPE,
      id: /* @ngInject */ ($http, serviceName) =>
        $http
          .get(`/dbaas/logs/${serviceName}/serviceInfos`)
          .then(({ data }) => data.serviceId),
      goBack: /* @ngInject */ ($state, $timeout, Alerter) => (
        message,
        type,
      ) => {
        const promise = $state.go('dbaas-logs.list', {});

        if (message) {
          promise.then(() =>
            $timeout(() =>
              Alerter.set(`alert-${type}`, message, null, 'logs-list-alert'),
            ),
          );
        }
      },
    },
  });
};
