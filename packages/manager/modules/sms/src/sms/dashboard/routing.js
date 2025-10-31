import component from './telecom-sms-dashboard.component';

const COMPLETED = 'COMPLETED';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.dashboard', {
    url: '',
    resolve: {
      completedBatches: /* @ngInject */ (batches) =>
        batches.filter(({ status }) => status === COMPLETED),
      getReloadCreditLink: /* @ngInject */ ($state) => () =>
        $state.href('sms.service.order'),
      getBatchesStatistics: /* @ngInject */ ($http, $q, serviceName) => (
        batches,
      ) =>
        $q
          .all(
            batches.map((batch) =>
              $http
                .get(`/sms/${serviceName}/batches/${batch.id}/statistics`)
                .then(({ data }) => ({
                  ...batch,
                  ...data,
                })),
            ),
          )
          .then((statisticsList) => statisticsList.flat()),
      goToCreditTransfer: /* @ngInject */ ($state) => () =>
        $state.go('sms.service.dashboard.creditTransfer'),
      goToOrderTime2Chat: /* @ngInject */ ($state) => () =>
        $state.go('sms.service.dashboard.orderTime2Chat'),
      goToCreditOrder: /* @ngInject */ ($state) => () =>
        $state.go('sms.service.order'),
      translationsRefresh: /* @ngInject */ ($translate) => $translate.refresh(),
      breadcrumb: () => null,
    },
    views: {
      'smsInnerView@sms.service': {
        component: component.name,
      },
    },
    atInternet: {
      ignore: true,
    },
  });
};
