import controller from './billing-account-billing-tollfree-history.controller';
import template from './billing-account-billing-tollfree-history.html';

export default /* ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.billing.tollfree-history', {
    url: '/tollfree-history',
    template,
    controller,
    controllerAs: 'TollfreeHistoryCtrl',
    translations: ['.'],
  });
};
