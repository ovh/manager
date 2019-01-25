import controller from './billing-account-orderAlias-international.controller';
import template from './billing-account-orderAlias-international.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.orderAlias.international', {
    url: '/international',
    template,
    controller,
    controllerAs: 'AliasOrderInternationalCtrl',
    translations: ['.'],
  });
};
