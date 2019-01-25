import controller from './billing-account-administration-lines-group.controller';
import template from './billing-account-administration-lines-group.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telephony.billingAccount.administration.linesGroup', {
    url: '/linesGroup',
    template,
    controller,
    controllerAs: 'LinesGroupCtrl',
    translations: ['.'],
  });
};
