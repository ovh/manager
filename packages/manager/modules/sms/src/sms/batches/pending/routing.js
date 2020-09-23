import component from './telecom-sms-batches-pending.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches.pending', {
    url: '/pending',
    views: {
      'smsView@sms.service': {
        component: component.name,
      },
    },
    resolve: {
      goToCancelBatch: /* @ngInject */ ($state) => (batch) =>
        $state.go('sms.service.batches.pending.cancel', {
          batch,
        }),
      goToDetails: /* @ngInject */ ($state) => (batch) =>
        $state.go('sms.service.batches.details', {
          batchId: batch.id,
          previousState: 'sms.service.batches.pending',
        }),
      plannedBatches: /* @ngInject */ (batches, batchStatuses) =>
        batches.filter(({ status }) =>
          [
            batchStatuses.PENDING,
            batchStatuses.INSERTING,
            batchStatuses.INSERTED,
          ].includes(status),
        ),
      reloadPage: /* @ngInject */ ($state) => () => $state.reload(),
    },
  });
};
