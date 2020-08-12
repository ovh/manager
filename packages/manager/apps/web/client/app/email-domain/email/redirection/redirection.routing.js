import template from './email-domain-email-redirection.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.email.redirection', {
    url: '/redirection',
    template,
    controller: 'EmailDomainEmailRedirectionCtrl',
    controllerAs: 'ctrlEmailDomainEmailRedirection',
    params: {
      quotas: {},
    },
    resolve: {
      quotas: /* @ngInject */ ($transition$) => $transition$.params().quotas,
    },
  });
};
