import controller from './email-domain-email-acl.controller';
import template from './email-domain-email-acl.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.email.domain.email.acl', {
    url: '/acl',
    template,
    controller,
    controllerAs: 'ctrlEmailDomainEmailAcl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('email_domain_email_acl'),
    },
  });
};
