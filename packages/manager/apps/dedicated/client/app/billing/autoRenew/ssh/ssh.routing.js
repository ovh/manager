import template from './user-ssh.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.ssh', {
    url: '/ssh',
    template,
    controller: 'UserAccount.controllers.ssh',
    controllerAs: 'ctrlSsh',
    translations: { value: ['.'], format: 'json' },
  });
};
