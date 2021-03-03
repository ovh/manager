import template from './email-domain-email-filter.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.email.filter', {
    url: '/filter',
    template,
    controller: 'EmailDomainEmailFilterCtrl',
    controllerAs: 'ctrlEmailDomainEmailFilter',
    params: {
      email: {},
      emails: [],
    },
    resolve: {
      email: /* @ngInject */ ($transition$) => $transition$.params().email,
      emails: /* @ngInject */ ($transition$) => $transition$.params().emails,
    },
  });
};
