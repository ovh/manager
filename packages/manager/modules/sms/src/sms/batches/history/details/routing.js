import moment from 'moment';

import component from './telecom-sms-batches-history-details.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches.history.details', {
    url: '/:batchId',
    views: {
      'smsView@sms.service': {
        component: component.name,
      },
    },
    resolve: {
      batch: /* @ngInject */ ($transition$, batches) =>
        batches.find(({ id }) => id === $transition$.params().batchId),
      getOutgoingSms: /* @ngInject */ (iceberg, serviceName) => (batch) =>
        iceberg(`/sms/${serviceName}/outgoing`)
          .query()
          .expand('CachedObjectList-Pages')
          .execute({
            'creationDatetime.from': batch.createdAt,
            'creationDatetime.to': moment().format(),
            batchId: batch.id,
          })
          .$promise.then(({ data }) => data),
      getPttDetails: /* @ngInject */ ($http) => (outgoing) =>
        $http({
          url: '/sms/ptts',
          method: 'GET',
          params: {
            ptt: outgoing.ptt,
          },
        }).then(({ data }) => data),
      goToDelete: /* @ngInject */ ($state) => (outgoing) =>
        $state.go('sms.service.batches.history.details.delete', {
          outgoing,
        }),
      outgoingSms: /* @ngInject */ (batch, getOutgoingSms) =>
        getOutgoingSms(batch),
    },
    translations: {
      value: ['.', '..'],
      format: 'json',
    },
  });
};
