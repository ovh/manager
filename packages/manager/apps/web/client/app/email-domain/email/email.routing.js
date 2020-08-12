import template from './email-domain-email.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.email', {
    url: '/email',
    template,
    controller: 'EmailDomainEmailCtrl',
    controllerAs: 'ctrlEmailDomainEmail',
    resolve: {
      goToAccountMigration: /* @ngInject */ ($state, $transition$) => (email) =>
        $state.go('app.email.domain.email.migrate', {
          ...$transition$.params(),
          email,
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
    },
  });
};
