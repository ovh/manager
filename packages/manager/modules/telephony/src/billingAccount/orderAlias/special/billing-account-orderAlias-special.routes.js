import controller from './billing-account-orderAlias-special.controller';
import template from './billing-account-orderAlias-special.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.orderAlias.special', {
    url: '/special',
    template,
    controller,
    controllerAs: 'AliasOrderSpecialCtrl',
    translations: ['.', '../../../alias/special/rsva'],
  });
};
