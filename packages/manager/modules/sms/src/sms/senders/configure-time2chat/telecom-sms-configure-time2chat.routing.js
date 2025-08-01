export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.senders.configure-time2chat', {
    url: '/:number/configure',
    views: {
      'smsView@sms.service': {
        component: 'smsSendersConfigureTime2Chat',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('sms_senders_configure_time2chat'),
    },
  });
};
