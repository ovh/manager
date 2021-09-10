import controller from './email-domain-email.controller';
import template from './email-domain-email.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.email', {
    url: '/email',
    template,
    controller,
    controllerAs: 'ctrlEmailDomainEmail',
    resolve: {
      goToAccountMigration: /* @ngInject */ ($state, $transition$) => (email) =>
        $state.go('app.email.domain.email.account.migrate', {
          ...$transition$.params(),
          email,
          accountName: email.accountName,
        }),
      goToAcl: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('app.email.domain.email.acl', $transition$.params()),
      goToEmail: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('app.email.domain.email', $transition$.params()),
      goToFilter: /* @ngInject */ ($state, $transition$) => (email, emails) =>
        $state.go('app.email.domain.email.filter', {
          ...$transition$.params(),
          email,
          emails,
        }),
      goToRedirection: /* @ngInject */ ($state, $transition$) => (quotas) =>
        $state.go('app.email.domain.email.redirection', {
          ...$transition$.params(),
          quotas,
        }),
      goToResponders: /* @ngInject */ ($state, $transition$) => (
        emails,
        quotas,
      ) =>
        $state.go('app.email.domain.email.responder', {
          ...$transition$.params(),
          emails,
          quotas,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('email_domain_email'),
    },
  });

  $stateProvider.state('app.email.domain.email.account', {
    url: '/:accountName',
    template: '<div ui-view></div>',
    redirectTo: 'app.email.domain.email',
    resolve: {
      accountName: /* @ngInject */ ($transition$) =>
        $transition$.params().accountName,
      breadcrumb: /* @ngInject */ (accountName) => accountName,
    },
  });
};
