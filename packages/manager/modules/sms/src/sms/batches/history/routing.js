import component from './telecom-sms-batches-history.component';

import {
  DETAILS_HIT,
  STATISTICS_HIT,
} from './telecom-sms-batches-history.constants';

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
      goToDashboard: /* @ngInject */ ($state, trackClick) => () => {
        trackClick(STATISTICS_HIT);
        return $state.go('sms.service.dashboard');
      },
      goToCancelBatch: /* @ngInject */ ($state) => (batchId) =>
        $state.go('sms.service.batches.history.cancel', {
          batchId,
        }),
      goToDetails: /* @ngInject */ ($state, trackClick) => (batch) => {
        trackClick(DETAILS_HIT);
        return $state.go('sms.service.batches.details', {
          batchId: batch.id,
          previousState: 'sms.service.batches.history',
        });
      },
    },
    views: {
      'smsView@sms.service': {
        component: component.name,
      },
    },
    atInternet: {
      rename: 'sms::service::campaign::outgoing',
    },
  });
};
