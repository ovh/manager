angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.sms.sms.templates', {
    url: '/templates',
    views: {
      'smsView@telecom.sms': {
        templateUrl: 'app/telecom/sms/sms/templates/telecom-sms-sms-templates.html',
        controller: 'TelecomSmsSmsTemplatesCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
