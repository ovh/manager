import component from './telecom-sms-batches-history.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches.history', {
    url: '/history',
    resolve: {
      activeBatches: /* @ngInject */ (batches, batchStatuses) =>
        batches.filter(({ status }) => status !== batchStatuses.CANCELED),
      displayErrorMessage: /* @ngInject */ ($translate, TucToast) => (
        errorMessage,
      ) => TucToast.error(errorMessage),
      displaySuccessMessage: /* @ngInject */ ($translate, TucToast) => (
        successMessage,
      ) => TucToast.success(successMessage),
      getDashboardHref: /* @ngInject */ ($state) => () =>
        $state.href('sms.service.dashboard'),
      goToCancelBatch: /* @ngInject */ ($state) => (batchId) =>
        $state.go('sms.service.batches.history.cancel', {
          batchId,
        }),
      goToDetails: /* @ngInject */ ($state) => (batch) =>
        $state.go('sms.service.batches.details', {
          batchId: batch.id,
          previousState: 'sms.service.batches.history',
        }),
    },
    views: {
      'smsView@sms.service': {
        component: component.name,
      },
    },
  });
};
