import template from './ACCOUNT.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sharepoint.product.account', {
    url: '/account',
    template,
    controller: 'SharepointAccountsCtrl',
    controllerAs: '$ctrl',
  });
};
