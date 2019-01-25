import controller from './billing-account-orderAlias-geographical.controller';
import template from './billing-account-orderAlias-geographical.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.orderAlias.geographical', {
    url: '/geographical',
    template,
    controller,
    controllerAs: 'AliasOrderGeographicalCtrl',
    translations: ['.'],
  });
};
