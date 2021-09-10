import controller from './email-domain-email-filter.controller';
import template from './email-domain-email-filter.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.email.filter', {
    url: '/filter',
    template,
    controller,
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
