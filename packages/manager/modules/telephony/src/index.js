import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/telecom-universe-components';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';

import constant from './telecom-telephony.constant';
import telecomTelephonyTemplate from './telecom-telephony.html';
import telecomTelephonyMainTemplate from './telecom-telephony-main.view.html';

import components from './components';
import billingAccountTpl from './billingAccount/telecom-telephony-billing-account.html';
import billingAccountCtrl from './billingAccount/telecom-telephony-billing-account.controller';

const moduleName = 'ovhManagerTelephony';

angular.module(moduleName, [
  components,
  'ovhManagerCore',
  'telecomUniverseComponents',
  'ui.router',
])
  .constant('TELEPHONY_INFRASTRUCTURE_OPTIONS', constant.TELEPHONY_INFRASTRUCTURE_OPTIONS)
  .constant('TELEPHONY_RMA', constant.TELEPHONY_RMA)
  .constant('TELEPHONY_REPAYMENT_CONSUMPTION', constant.TELEPHONY_REPAYMENT_CONSUMPTION)
  .constant('TELEPHONY_SERVICE', constant.TELEPHONY_SERVICE)
  .constant('TELEPHONY_ALIAS_CONFERENCE', constant.TELEPHONY_ALIAS_CONFERENCE)
  .constant('TELEPHONY_ALIAS_CONTACT_CENTER_SOLUTION', constant.TELEPHONY_ALIAS_CONTACT_CENTER_SOLUTION)
  .constant('TELEPHONY_ALIAS_OBSOLETE_FEATURE_TYPES', constant.TELEPHONY_ALIAS_OBSOLETE_FEATURE_TYPES)
  .constant('TELEPHONY_GUIDES', constant.TELEPHONY_GUIDES)
  .constant('TELEPHONY_REDIRECT_URLS', constant.TELEPHONY_REDIRECT_URLS)
  .constant('TELEPHONY_REDIRECT_V4_HASH', constant.TELEPHONY_REDIRECT_V4_HASH)
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
        /* @TODO
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
      /* @TODO
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
