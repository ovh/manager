angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.line.phone.accessories', {
    url: '/accessories',
    views: {
      'lineView@telecom.telephony.line': {
        templateUrl: 'app/telecom/telephony/line/phone/accessories/telecom-telephony-line-phone-accessories.html',
        controller: 'TelecomTelephonyLinePhoneAccessoriesCtrl',
        controllerAs: 'AccessoriesCtrl',
      },
      'choiceView@telecom.telephony.line.phone.accessories': {
        templateUrl: 'app/telecom/telephony/line/phone/accessories/choice/telecom-telephony-line-phone-accessories-choice.html',
        controller: 'TelecomTelephonyLinePhoneAccessoriesChoiceCtrl',
        controllerAs: 'AccessoriesChoiceCtrl',
        noTranslations: true,
      },
      'shippingView@telecom.telephony.line.phone.accessories': {
        templateUrl: 'app/telecom/telephony/line/phone/accessories/shipping/telecom-telephony-line-phone-accessories-shipping.html',
        controller: 'TelecomTelephonyLinePhoneAccessoriesShippingCtrl',
        controllerAs: 'AccessoriesShippingCtrl',
        noTranslations: true,
      },
      'resumeView@telecom.telephony.line.phone.accessories': {
        templateUrl: 'app/telecom/telephony/line/phone/accessories/resume/telecom-telephony-line-phone-accessories-resume.html',
        controller: 'TelecomTelephonyLinePhoneAccessoriesResumeCtrl',
        controllerAs: 'AccessoriesResumeCtrl',
        noTranslations: true,
      },
      'finalizeView@telecom.telephony.line.phone.accessories': {
        templateUrl: 'app/telecom/telephony/line/phone/accessories/finalize/telecom-telephony-line-phone-accessories-finalize.html',
        controller: 'TelecomTelephonyLinePhoneAccessoriesFinalizeCtrl',
        controllerAs: 'AccessoriesFinalizeCtrl',
        noTranslations: true,
      },
    },
    translations: ['.'],
  });
});
