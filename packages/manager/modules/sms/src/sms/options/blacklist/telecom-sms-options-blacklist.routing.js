export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sms.service.options.blacklist', {
    url: '/blacklist',
    views: {
      'smsView@sms.service': 'telecomSmsOptionsBlacklist',
    },
    translations: { value: ['.'], format: 'json' },
  });
};
