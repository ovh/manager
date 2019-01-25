import template from './telecom-telephony-billing-account.html';
import controller from './telecom-telephony-billing-account.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount', {
    url: '/:billingAccount',
    template,
    controller,
    controllerAs: 'BillingAccountCtrl',
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
    translations: ['.'],
  });
};
