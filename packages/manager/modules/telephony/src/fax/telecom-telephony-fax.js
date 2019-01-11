angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.fax', {
    url: '/fax/:serviceName',
    views: {
      'telephonyView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/fax/telecom-telephony-fax.html',
      },
      'faxView@telecom.telephony.fax': {
        templateUrl: 'app/telecom/telephony/fax/telecom-telephony-fax-main-view.html',
        controller: 'TelecomTelephonyFaxCtrl',
        controllerAs: '$ctrl',
      },
      'faxInnerView@telecom.telephony.fax': {
        templateUrl: 'app/telecom/telephony/fax/management/telecom-telephony-fax-management.html',
        controller: 'TelecomTelephonyFaxManagementCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.', './management'],
    resolve: {
      $title(translations, $translate, $stateParams) {
        return $translate('telephony_fax_page_title', { name: $stateParams.serviceName });
      },
    },
  });
});
