import moment from 'moment';

import component from './telecom-sms-batches-details.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches.details', {
    url: '/:batchId',
    views: {
      'smsView@sms.service': {
        component: component.name,
      },
    },
    params: {
      previousState: '^',
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
      goBack: /* @ngInject */ ($state, $transition$) => (options) =>
        $state.go($transition$.params().previousState, {}, options),
      goToDelete: /* @ngInject */ ($state) => (outgoing) =>
        $state.go('sms.service.batches.details.delete', {
          outgoing,
        }),
      goToStatistics: /* @ngInject */ ($state) => (batch) =>
        $state.go('sms.service.batches.statistics', {
          batch,
        }),
      outgoingSms: /* @ngInject */ (batch, getOutgoingSms) =>
        getOutgoingSms(batch),
    },
  });
};
