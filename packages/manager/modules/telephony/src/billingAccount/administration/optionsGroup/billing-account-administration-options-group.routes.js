import controller from './billing-account-administration-options-group.controller';
import template from './billing-account-administration-options-group.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.administration.optionsGroup', {
    url: '/optionsGroup',
    template,
    controller,
    controllerAs: 'OptionsGroupCtrl',
    translations: ['.'],
  });
};
