import component from './telecom-sms-batches-history.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.batches.history', {
    url: '/history',
    resolve: {
      completedBatches: /* @ngInject */ (batchStatuses, getBatches) =>
        getBatches().then((batches) =>
          batches
            .sort(
              (batchA, batchB) =>
                new Date(batchB.createdAt) - new Date(batchA.createdAt),
            )
            .filter(({ status }) => status === batchStatuses.COMPLETED),
        ),
      displayErrorMessage: /* @ngInject */ ($translate, TucToast) => (
        errorMessage,
      ) => TucToast.error(errorMessage),
      displaySuccessMessage: /* @ngInject */ ($translate, TucToast) => (
        successMessage,
      ) => TucToast.success(successMessage),
      getDashboardHref: /* @ngInject */ ($state) => () =>
        $state.href('sms.service.dashboard'),
      getDetailsHref: /* @ngInject */ ($state) => (batchId) =>
        $state.href('sms.service.batches.details', {
          id: batchId,
        }),
      goToCancelBatch: /* @ngInject */ ($state) => (batchId) =>
        $state.go('sms.service.batches.history.cancel', {
          batchId,
        }),
    },
    views: {
      'smsView@sms.service': {
        component: component.name,
      },
    },
  });
};
