angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.sms', {
    url: '/sms/:serviceName',
    views: {
      'telecomView@telecom': {
        templateUrl: 'app/telecom/sms/telecom-sms.html',
      },
      'smsView@telecom.sms': {
        templateUrl: 'app/telecom/sms/telecom-sms-main.view.html',
        controller: 'TelecomSmsCtrl',
        controllerAs: 'TelecomSmsCtrl',
      },
    },
    abstract: true,
    resolve: {
      initSms: ($q, $stateParams, TucSmsMediator) => {
        // init sms services
        TucSmsMediator.initAll().then(smsDetails => TucSmsMediator
          .setCurrentSmsService(smsDetails[$stateParams.serviceName]));
        return $q.when({ init: true });
      },
      $title: (translations, $translate, OvhApiSms, $stateParams) => OvhApiSms.v6()
        .get({
          serviceName: $stateParams.serviceName,
        }).$promise
        .then(data => $translate.instant('sms_page_title', { name: data.description || $stateParams.serviceName }, null, null, 'escape'))
        .catch(() => $translate('sms_page_title', { name: $stateParams.serviceName })),
    },
    translations: [
      '../sms',
    ],
  });
});
