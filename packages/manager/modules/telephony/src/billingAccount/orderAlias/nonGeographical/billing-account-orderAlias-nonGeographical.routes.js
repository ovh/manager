import controller from './billing-account-orderAlias-nonGeographical.controller';
import template from './billing-account-orderAlias-nonGeographical.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.orderAlias.nongeographical', {
    url: '/nonGeographical',
    template,
    controller,
    controllerAs: 'AliasOrderNonGeographicalCtrl',
    translations: ['.'],
  });
};
