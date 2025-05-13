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
      goToDetails: /* @ngInject */ ($state, trackClick) => (batch) => {
        trackClick('sms::service::campaign::reports::get-details');
        return $state.go('sms.service.batches.details', {
          batchId: batch.id,
        });
      },
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('sms_batches_statistics_title'),
    },
    atInternet: {
      rename: 'sms::service::campaign::reports',
    },
  });
};
