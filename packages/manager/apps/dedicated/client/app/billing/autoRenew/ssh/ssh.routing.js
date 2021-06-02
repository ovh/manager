import controller from './user-ssh.controller';
import template from './user-ssh.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.account.billing.autorenew.ssh', {
    url: '/ssh',
    template,
    controller,
    controllerAs: 'ctrlSsh',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('user_ssh_title'),
      hideBreadcrumb: /* @ngInject */ (isAutorenewManagementAvailable) =>
        !isAutorenewManagementAvailable,
    },
  });
};
