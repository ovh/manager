export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.statistics', {
    url: '/statistics',
    views: {
      smsInnerView: {
        component: 'ovhManagerSmsStatisticsComponent',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('sms_statistics_breadcrumb'),
      goToSmsOrder: /* @ngInject */ ($state, atInternet, serviceName) => () => {
        atInternet.trackClick({
          name: 'sms::statistics::recharge-credits',
          type: 'action',
        });
        return $state.go('sms.service.order', { serviceName });
      },
    },
  });
};
