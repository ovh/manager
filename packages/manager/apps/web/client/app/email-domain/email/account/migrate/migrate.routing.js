import template from './email-domain-email-account-migrate.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.email.account.migrate', {
    url: '/migrate',
    template,
    controller: 'EmailsMigrateAccountCtrl',
    controllerAs: 'ctrl',
    params: {
      email: {},
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('email_domain_email_account_migrate'),
    },
  });
};
