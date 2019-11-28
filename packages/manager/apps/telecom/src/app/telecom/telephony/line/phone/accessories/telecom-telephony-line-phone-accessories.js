angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.line.phone.accessories', {
    url: '/accessories',
    views: {
      'lineView@telecom.telephony.billingAccount.line': {
        templateUrl: 'app/telecom/telephony/line/phone/accessories/telecom-telephony-line-phone-accessories.html',
        controller: 'TelecomTelephonyLinePhoneAccessoriesCtrl',
        controllerAs: 'AccessoriesCtrl',
      },
      'choiceView@telecom.telephony.billingAccount.line.phone.accessories': {
        templateUrl: 'app/telecom/telephony/line/phone/accessories/choice/telecom-telephony-line-phone-accessories-choice.html',
        controller: 'TelecomTelephonyLinePhoneAccessoriesChoiceCtrl',
        controllerAs: 'AccessoriesChoiceCtrl',
        noTranslations: true,
      },
      'shippingView@telecom.telephony.billingAccount.line.phone.accessories': {
        templateUrl: 'app/telecom/telephony/line/phone/accessories/shipping/telecom-telephony-line-phone-accessories-shipping.html',
        controller: 'TelecomTelephonyLinePhoneAccessoriesShippingCtrl',
        controllerAs: 'AccessoriesShippingCtrl',
        noTranslations: true,
      },
      'resumeView@telecom.telephony.billingAccount.line.phone.accessories': {
        templateUrl: 'app/telecom/telephony/line/phone/accessories/resume/telecom-telephony-line-phone-accessories-resume.html',
        controller: 'TelecomTelephonyLinePhoneAccessoriesResumeCtrl',
        controllerAs: 'AccessoriesResumeCtrl',
        noTranslations: true,
      },
      'finalizeView@telecom.telephony.billingAccount.line.phone.accessories': {
        templateUrl: 'app/telecom/telephony/line/phone/accessories/finalize/telecom-telephony-line-phone-accessories-finalize.html',
        controller: 'TelecomTelephonyLinePhoneAccessoriesFinalizeCtrl',
        controllerAs: 'AccessoriesFinalizeCtrl',
        noTranslations: true,
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
