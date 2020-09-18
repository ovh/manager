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
      getDetailsHref: /* @ngInject */ ($state) => (batchId) =>
        $state.href('sms.service.batches.details', {
          id: batchId,
        }),
      goToCancelBatch: /* @ngInject */ ($state) => (batch) =>
        $state.go('sms.service.batches.history.cancel', {
          batch,
        }),
    },
    views: {
      'smsView@sms.service': {
        component: component.name,
      },
    },
  });
};
