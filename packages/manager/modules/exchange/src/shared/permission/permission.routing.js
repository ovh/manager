import template from './shared-permission.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.shared.permission', {
    url: '/permission',
    controller: 'ExchangeTabPublicFolderPermissionsCtrl',
    controllerAs: 'ctrl',
    template,
  });
};
