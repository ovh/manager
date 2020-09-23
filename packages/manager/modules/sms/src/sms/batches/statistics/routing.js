import component from './telecom-sms-batches-statistics.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches.statistics', {
    url: '/statistics',
    params: {
      batch: null,
    },
    views: {
      'smsView@sms.service': {
        component: component.name,
      },
    },
    resolve: {
      batch: /* @ngInject */ ($transition$) => $transition$.params().batch,
      getBatchStatistics: /* @ngInject */ ($http, serviceName) => (batchId) =>
        $http
          .get(`/sms/${serviceName}/batches/${batchId}/statistics`)
          .then(({ data }) => data),
      goToDetails: /* @ngInject */ ($state) => (batch) =>
        $state.go('sms.service.batches.details', {
          batchId: batch.id,
        }),
    },
  });
};
