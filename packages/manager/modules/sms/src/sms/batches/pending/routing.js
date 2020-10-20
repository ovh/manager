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
      displayErrorMessage: /* @ngInject */ ($translate, TucToast) => (
        errorMessage,
      ) => TucToast.error(errorMessage),
      displaySuccessMessage: /* @ngInject */ ($translate, TucToast) => (
        successMessage,
      ) => TucToast.success(successMessage),
      goToCancelBatch: /* @ngInject */ ($state) => (batchId) =>
        $state.go('sms.service.batches.pending.cancel', {
          batchId,
        }),
      goToDetails: /* @ngInject */ ($state) => (batch) =>
        $state.go('sms.service.batches.details', {
          batchId: batch.id,
          previousState: 'sms.service.batches.pending',
        }),
      plannedBatches: /* @ngInject */ (getBatches, batchStatuses) =>
        getBatches().then((batches) =>
          batches
            .sort(
              (batchA, batchB) =>
                new Date(batchB.createdAt) - new Date(batchA.createdAt),
            )
            .filter(({ status }) =>
              [
                batchStatuses.PENDING,
                batchStatuses.INSERTING,
                batchStatuses.INSERTED,
              ].includes(status),
            ),
        ),
      reloadPage: /* @ngInject */ ($state) => () => $state.reload(),
    },
    atInternet: {
      rename: 'sms::service::campaign::pending',
    },
  });
};
