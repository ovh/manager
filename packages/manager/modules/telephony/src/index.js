import angular from 'angular';

import telecomTelephonyTemplate from './telecom-telephony.html';
import telecomTelephonyMainTemplate from './telecom-telephony-main.view.html';

import components from './components';
import billingAccountTpl from './billingAccount/telecom-telephony-billing-account.html';
import billingAccountCtrl from './billingAccount/telecom-telephony-billing-account.controller';

const moduleName = 'ovhManagerTelephony';

angular.module(moduleName, [
  components,
  'ui.router',
])
  .config(($stateProvider) => {
    $stateProvider.state('telephony', {
      url: '/telephony/:billingAccount',
      views: {
        '': {
          template: billingAccountTpl,
          controller: billingAccountCtrl,
        },
        'telecomView@telephony': {
          template: telecomTelephonyTemplate,
        },
        'telephonyView@telephony': {
          template: telecomTelephonyMainTemplate,
        },
        /*
        'groupView@telecom.telephony': {
          templateUrl: 'app/telecom/telephony/billingAccount/telecom-telephony-billing-account.html',
          controller: 'TelecomTelephonyBillingAccountCtrl',
          controllerAs: 'BillingAccountCtrl',
        },
        'groupInnerView@telephony': {
          templateUrl: 'app/telecom/telephony/billingAccount/dashboard/telecom-telephony-billing-account-dashboard.html',
          controller: 'TelecomTelephonyBillingAccountDashboardCtrl',
          controllerAs: 'DashboardCtrl',
        },
        */
      },
      /*
      resolve: {
        initTelephony($q, $stateParams, TelephonyMediator) {
          // init all groups, lines and numbers
          TelephonyMediator.init()
            .then(() => TelephonyMediator.getGroup($stateParams.billingAccount)
              .then(group => TelephonyMediator.setCurrentGroup(group)));
          return $q.when({ init: true });
        },
        $title(translations, $translate, $stateParams, OvhApiTelephony) {
          return OvhApiTelephony.v6().get({
            billingAccount: $stateParams.billingAccount,
          }).$promise.then(data => $translate.instant('telephony_page_title', { name: data.description || $stateParams.billingAccount }, null, null, 'escape')).catch(() => $translate('telephony_page_title', { name: $stateParams.billingAccount }));
        },
      },
      */
      translations: ['.', './billingAccount', './billingAccount/dashboard'],
    });
  });

export default moduleName;
