import controller from './billing-account-abbreviatedNumbers.controller';
import template from './billing-account-abbreviatedNumbers.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.abbreviatedNumbers', {
    url: '/abbreviatedNumbers',
    template,
    controller,
    controllerAs: 'AbbreviatedNumbersCtrl',
    translations: ['.'],
  });
};
