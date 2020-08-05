export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.options.blacklist', {
    url: '/blacklist',
    views: {
      'smsView@sms.service': 'telecomSmsOptionsBlacklist',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('sms_senders_blacklisted_manage_title'),
    },
  });
};
