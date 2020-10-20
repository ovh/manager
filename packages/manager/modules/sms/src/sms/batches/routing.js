import component from './telecom-sms-batches.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches', {
    url: '/batches',
    views: {
      'smsInnerView@sms.service': {
        component: component.name,
      },
    },
    resolve: {
      batchStatuses: /* @ngInject */ (schema) =>
        schema.models['sms.BatchStatusEnum'].enum.reduce(
          (list, status) => ({
            ...list,
            [status]: status,
          }),
          {},
        ),
      cancelBatch: /* @ngInject */ ($http, serviceName) => (batchId) =>
        $http.post(`/sms/${serviceName}/batches/${batchId}/cancel`),
      formatStatus: /* @ngInject */ (batchStatuses) => (status) => {
        switch (status) {
          case batchStatuses.PENDING:
          case batchStatuses.INSERTING:
          case batchStatuses.INSERTED:
            return batchStatuses.PENDING;
          default:
            return status;
        }
      },
      goBack: /* @ngInject */ ($state) => (options) =>
        $state.go('^', {}, options),
      schema: /* @ngInject */ ($http) =>
        $http.get('/sms.json').then(({ data: schema }) => schema),
    },
    atInternet: {
      rename: 'sms::service::campaign',
    },
  });
};
